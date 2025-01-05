package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.Choice;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.UserSkills;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserSkillsRepository;
import com.wgtpivotlo.wgtpivotlo.repository.criteria.CareerSkillAssociationRepositoryImpl;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.*;

@Slf4j
@Service
public class CareerRecommendationService {
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final UserSkillsRepository userSkillsRepository;

    @Autowired
    public CareerRecommendationService(CareerSkillAssociationRepository careerSkillAssociationRepository, CareerSkillAssociationRepositoryImpl careerSkillAssociationRepositoryImpl, UserSkillsRepository userSkillsRepository) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.userSkillsRepository = userSkillsRepository;
    }

    private Optional<Page<Object[]>> queryCareersByType(Choice type, List<CareerSkillDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector){
        return switch (type) {
            case DIRECT_MATCH -> careerSkillAssociationRepository.findDirectMatches(skillsProfiencyList,careerLevel,pageable,sector);
            case ASPIRATION -> careerSkillAssociationRepository.findAspirational(skillsProfiencyList,careerLevel,pageable,sector);
            case PATHWAY -> careerSkillAssociationRepository.findPathways(skillsProfiencyList,careerLevel,pageable,sector);
            default -> throw new RuntimeException("type does not belong in RecommendationType");
        };
    }

    public PageDTO<CareerWithSimilarityScoreDTO> getRecommendedCareers(CareerRecommendationDTO request, Authentication authentication){
//        // Paging
//        int correctedPageNumber = (request.getPageNumber() > 0) ? request.getPageNumber() - 1 : 0;

        // totalPage is n, pageNumber must be from 0 to n
        if (request.getPageNumber() < 0){
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        Pageable pageable = PageRequest.of(request.getPageNumber(), request.getPageSize());

        // get userId
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();

        // get user's skills
        Optional<List<UserSkills>> existingUserSkills = userSkillsRepository.findByUserId(userId);

        existingUserSkills.orElseThrow(() -> new ResourceNotFoundException("No skills found"));

        List<UserSkills> userSkills = existingUserSkills.get();
        List<CareerSkillDTO> skillsProfiencyList = userSkills.stream().map((userSkill -> CareerSkillDTO.builder().skillId(userSkill.getSkill().getSkillId()).profiency(userSkill.getProfiency()).build())).toList();

        log.info("Step1a: Making a query to get careers with similarity score");
        // Get all the career related to skills and profiency along with similarity score.
        Optional<Page<Object[]>> careerRecommendation = queryCareersByType(request.getType(), skillsProfiencyList, request.getCareerLevel(), pageable, Optional.ofNullable(request.getSector()));

        if (careerRecommendation.isEmpty()){
            log.warn("No career returned");
            throw new ResourceNotFoundException("No career found");
        }

//        if (correctedPageNumber >= careerRecommendation.get().getTotalPages()) {
//            log.warn("Page number out of bounds");
//            throw new PageItemsOutOfBoundException("Page number out of bounds");
//        }

        log.info("Step1b: Cleaning up data");
        List<Object[]> careersWithSimilarityScorePageList = careerRecommendation.get().getContent();
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

        return new PageDTO<>(careerRecommendation.get().getTotalPages(), request.getPageNumber(), careerWithSimilarityScoreDTOList);

    }
}
