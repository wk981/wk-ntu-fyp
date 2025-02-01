package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.Choice;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.model.UserSkills;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserSkillsRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class CareerRecommendationService {
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final UserSkillsRepository userSkillsRepository;
    private final UserRepository userRepository;

    @Autowired
    public CareerRecommendationService(CareerSkillAssociationRepository careerSkillAssociationRepository, UserSkillsRepository userSkillsRepository, UserRepository userRepository) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.userSkillsRepository = userSkillsRepository;
        this.userRepository = userRepository;
    }

    private Optional<Page<Object[]>> queryCareersByType(Choice type, List<SkillIdWithProfiencyDTO> skillsProfiencyList, Optional<CareerLevel> careerLevel, Pageable pageable, Optional<String> sector) {
        return switch (type) {
            case DIRECT_MATCH -> careerLevel.map(level ->
                    careerSkillAssociationRepository.findDirectMatches(skillsProfiencyList, level, pageable, Optional.ofNullable(sector.orElse(null)))
            ).orElseThrow(() -> new RuntimeException("Career level must be present for DIRECT_MATCH"));

            case ASPIRATION -> careerLevel.map(level ->
                    careerSkillAssociationRepository.findAspirational(skillsProfiencyList, level, pageable, Optional.ofNullable(sector.orElse(null)))
            ).orElseThrow(() -> new RuntimeException("Career level must be present for ASPIRATION"));

            case PATHWAY -> careerLevel.map(level ->
                    careerSkillAssociationRepository.findPathways(skillsProfiencyList, level, pageable, Optional.ofNullable(sector.orElse(null)))
            ).orElseThrow(() -> new RuntimeException("Career level must be present for PATHWAY"));

            case USER, CAREER -> careerSkillAssociationRepository.recommend(skillsProfiencyList, pageable);
            default -> throw new RuntimeException("Type does not belong in RecommendationType");
        };
    }

    public PageDTO<CareerWithSimilarityScoreDTO> getRecommendedCareers(CareerRecommendationDTO request, Authentication authentication){
        // Paging
        int correctedPageNumber = (request.getPageNumber() > 0) ? request.getPageNumber() - 1 : 0;

        // totalPage is n, pageNumber must be from 0 to n
        if (request.getPageNumber() < 0){
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        Pageable pageable = PageRequest.of(correctedPageNumber, request.getPageSize());

        // get userId
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();
        List<SkillIdWithProfiencyDTO> skillsProfiencyList;

        if(request.getType() == Choice.CAREER){
            Optional<User> existingUser = userRepository.findById(userId);
            existingUser.orElseThrow(()-> new ResourceNotFoundException("User not found"));

            Optional<Long> existingCareerId = existingUser.get().getCareerId().describeConstable();
            existingCareerId.orElseThrow(() -> new ResourceNotFoundException("User has not specify career"));

            Optional<List<CareerSkills>> existingCareerSkills = careerSkillAssociationRepository.findByCareerIdsNative(Collections.singletonList(existingCareerId.get()));
            skillsProfiencyList = existingCareerSkills
                    .get()
                    .stream()
                    .map((careerSkill -> SkillIdWithProfiencyDTO.builder().skillId(careerSkill.getSkill().getSkillId()).profiency(careerSkill.getProfiency()).build()))
                    .toList();
        }
        else{
            // get user's skills
            Optional<List<UserSkills>> existingUserSkills = userSkillsRepository.findByUserId(userId);
            existingUserSkills.orElseThrow(() -> new ResourceNotFoundException("No skills found"));
            List<UserSkills> userSkills = existingUserSkills.get();
            skillsProfiencyList = userSkills.stream().map((userSkill -> SkillIdWithProfiencyDTO.builder().skillId(userSkill.getSkill().getSkillId()).profiency(userSkill.getProfiency()).build())).toList();
        }

        log.info("Making a query to get careers with similarity score");
        // Get all the career related to skills and profiency along with similarity score.
        Optional<Page<Object[]>> result = queryCareersByType(
                request.getType(),
                skillsProfiencyList,
                Optional.ofNullable(request.getCareerLevel()), // Wrap in Optional
                pageable, // Example pageable
                Optional.ofNullable(request.getSector()) // Wrap in Optional
        );
        return mapping(correctedPageNumber,request.getPageNumber(),result);

    }

    public HashMap<String, PageDTO<CareerWithSimilarityScoreDTO>> getRecommendationExploreOtherCareer(com.wgtpivotlo.wgtpivotlo.dto.PageRequest request, Authentication authentication){
        // Paging
        int correctedPageNumber = (request.getPageNumber() > 0) ? request.getPageNumber() - 1 : 0;

        // totalPage is n, pageNumber must be from 0 to n
        if (request.getPageNumber() < 0){
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        Pageable pageable = PageRequest.of(correctedPageNumber, request.getPageSize());

        // get userId
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();
        Optional<User> existingUser = userRepository.findById(userId);

        existingUser.orElseThrow(()-> new ResourceNotFoundException("User not found"));
        Optional<Long> existingCareerId = existingUser.get().getCareerId().describeConstable();
        existingCareerId.orElseThrow(() -> new ResourceNotFoundException("User has not specify career"));

        Optional<List<UserSkills>> existingUserSkills = userSkillsRepository.findByUserId(userId);
        existingUserSkills.orElseThrow(() -> new ResourceNotFoundException("No skills found"));

        List<UserSkills> userSkills = existingUserSkills.get();
        List<SkillIdWithProfiencyDTO> skillsProfiencyList = userSkills.stream().map((userSkill -> SkillIdWithProfiencyDTO.builder().skillId(userSkill.getSkill().getSkillId()).profiency(userSkill.getProfiency()).build())).toList();

        Optional<List<CareerSkills>> existingCareerSkills = careerSkillAssociationRepository.findByCareerIdsNative(Collections.singletonList(existingCareerId.get()));
        List<SkillIdWithProfiencyDTO> careerSkillsList = existingCareerSkills
                .get()
                .stream()
                .map((careerSkill -> SkillIdWithProfiencyDTO.builder().skillId(careerSkill.getSkill().getSkillId()).profiency(careerSkill.getProfiency()).build()))
                .toList();

        // recommend 1. similar to user's skills 2. similar to preference career's skill
        Optional<Page<Object[]>> userSkillsRecommend = careerSkillAssociationRepository.recommend(skillsProfiencyList, pageable);
        Optional<Page<Object[]>> careerSkillsRecommend = careerSkillAssociationRepository.recommend(careerSkillsList, pageable);

        PageDTO<CareerWithSimilarityScoreDTO> userSkillsRecommendationMapping = mapping(correctedPageNumber, request.getPageNumber(), userSkillsRecommend);
        PageDTO<CareerWithSimilarityScoreDTO> careerSkillsRecommendationMapping = mapping(correctedPageNumber, request.getPageNumber(), careerSkillsRecommend);

        HashMap<String, PageDTO<CareerWithSimilarityScoreDTO>> res = new HashMap<>();
        res.put("user", userSkillsRecommendationMapping);
        res.put("career", careerSkillsRecommendationMapping);

        return res;
    }

    private PageDTO<CareerWithSimilarityScoreDTO> mapping(int correctedPageNumber, int pageNumber, Optional<Page<Object[]>> result){
        if (result.isEmpty()){
            log.warn("No career returned");
            throw new ResourceNotFoundException("No career found");
        }

        if (correctedPageNumber >= result.get().getTotalPages()) {
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }
        log.info("Cleaning up data");
        List<Object[]> careersWithSimilarityScorePageList = result.get().getContent();
        List<CareerWithSimilarityScoreDTO> careerWithSimilarityScoreDTOList = careersWithSimilarityScorePageList
                .stream()
                .map((Object[] objects)-> {
                            Career career = (Career) objects[0];
                            Double similarityScore = (Double) objects[1];
                            return CareerWithSimilarityScoreDTO
                                    .builder()
                                    .career(career)
                                    .similarityScore(String.format("%.2f", similarityScore))
                                    .build();
                        }
                ).toList();

        return new PageDTO<>(result.get().getTotalPages(), pageNumber, careerWithSimilarityScoreDTOList);
    }

}
