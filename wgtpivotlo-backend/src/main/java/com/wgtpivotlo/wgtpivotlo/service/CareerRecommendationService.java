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

<<<<<<< Updated upstream
    private PageDTO<CareerWithSimilarityScoreDTO> mapping(int correctedPageNumber, int pageNumber, Optional<Page<Object[]>> result){
        if (result.isEmpty()){
            log.warn("No career returned");
            throw new ResourceNotFoundException("No career found");
        }

        if (correctedPageNumber >= result.get().getTotalPages()) {
=======
    public HashMap<String, List<CareerWithSimilarityScoreDTO>> getQuestionaireRecommendation(List<SkillIdWithProfiencyDTO> skillsProfiencyList,
                                                                                         CareerLevel careerLevel,
                                                                                         Pageable pageable,
                                                                                         Optional<String> sector
    ){
        Parameters parameters = getCareerSimilarityWithPaginationHelper(skillsProfiencyList);

        Page<CareerWithSimilarityScoreDTO> pathwayResult = getCareerSimilarityWithPagination(
                parameters.getSkillMap(),
                parameters.getSkillIds(),
                Optional.of(careerLevel),
                Optional.of(Choice.PATHWAY),
                Optional.ofNullable(null),
                pageable
        );
        Page<CareerWithSimilarityScoreDTO> directResult = getCareerSimilarityWithPagination(
                parameters.getSkillMap(),
                parameters.getSkillIds(),
                Optional.of(careerLevel),
                Optional.of(Choice.DIRECT_MATCH),
                Optional.of(String.valueOf(sector)),
                pageable
        );
        Page<CareerWithSimilarityScoreDTO> aspirationResult = getCareerSimilarityWithPagination(
                parameters.getSkillMap(),
                parameters.getSkillIds(),
                Optional.of(careerLevel),
                Optional.of(Choice.ASPIRATION),
                Optional.ofNullable(null),
                pageable
        );

        HashMap<String, List<CareerWithSimilarityScoreDTO>> res = new HashMap<>();
        res.put("pathwayMatches", pathwayResult.getContent());
        res.put("directMatches", directResult.getContent());
        res.put("aspirationMatches", aspirationResult.getContent());
        return res;
    }

    private PageDTO<CareerWithSimilarityScoreDTO> mapping(int correctedPageNumber, int pageNumber, Page<CareerWithSimilarityScoreDTO> res){
        if (correctedPageNumber >= res.getTotalPages()) {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        return new PageDTO<>(result.get().getTotalPages(), pageNumber, careerWithSimilarityScoreDTOList);
=======
    private Page<CareerWithSimilarityScoreDTO> getCareerSimilarityWithPagination(
            Map<Long, SkillLevel> skillIdToSkillLevelMap,
            List<Long> skillIdList,
            Optional<CareerLevel> preferedCareerLevel,
            Optional<Choice> recommendationChoice,
            Optional<String> sector,
            Pageable pageable
    ) {
        // Step 1: Fetch all the careers with skills that contains the skillIds
        List<CareerWithSkillsDTO> careerWithSkillsDTOList = careerSkillAssociationService.findAllCareerBySkillIdList(skillIdList);
        List<CareerWithSimilarityScoreDTO> careerSimilarityList = new ArrayList<>();

        // Step 2a: Compare career's skills with user skills
        for(CareerWithSkillsDTO careerWithSkillsDTO: careerWithSkillsDTOList){
            long careerId = careerWithSkillsDTO.getCareer_id(); // current careerId
            List<SkillWithProfiencyDTO> skillWithProfiencyDTOList = careerWithSkillsDTO.getSkillsWithProfiency(); // current skills tied with career
            double weightedScore = 0;
            for(SkillWithProfiencyDTO skillWithProfiencyDTO: skillWithProfiencyDTOList){ // go thru skill and profiency
                if(skillIdToSkillLevelMap.containsKey(skillWithProfiencyDTO.getSkillId())){ // check if skillId exist in skillIdMap (normally user or career)
                    weightedScore += skillIdToSkillLevelMap.get(skillWithProfiencyDTO.getSkillId()).toWeightedDouble(); // calculate weightedScore
                }
            }

            // Build career
            Career career = Career
                    .builder()
                    .careerId(careerId)
                    .title(careerWithSkillsDTO.getTitle())
                    .careerLevel(careerWithSkillsDTO.getCareerLevel())
                    .responsibility(careerWithSkillsDTO.getResponsibility())
                    .sector(careerWithSkillsDTO.getSector())
                    .pic_url(careerWithSkillsDTO.getPic_url())
                    .build();

            int totalCareerSkills = skillWithProfiencyDTOList.size(); // career's total skill counts
            double careerSimilarityScore = weightedScore / Math.max(totalCareerSkills, 1); // Prevent division by zero
            double totalWeightedSimilarityScore = 0;

            // Only for questionaire result
            if (preferedCareerLevel.isPresent() && recommendationChoice.isPresent() && sector.isPresent()){
                totalWeightedSimilarityScore += (careerSimilarityScore * 0.75) + (preferedCareerLevel.get().toWeightedDouble() * (1 - 0.75));
            }
            else{
                totalWeightedSimilarityScore = careerSimilarityScore;
            }

            careerSimilarityList.add(new CareerWithSimilarityScoreDTO(career, totalWeightedSimilarityScore));
        }


        // Step 3: Apply sort
        careerSimilarityList.sort(Comparator.comparing(CareerWithSimilarityScoreDTO::getSimilarityScore).reversed());
        if (preferedCareerLevel.isPresent() && recommendationChoice.isPresent() && sector.isPresent()){
            sortCareerWithSimilarityScoreDTOBySkillLevel(careerSimilarityList, preferedCareerLevel.get(), recommendationChoice.get(), sector.get());
        }

        // Step 4: Apply Pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), careerSimilarityList.size());
        List<CareerWithSimilarityScoreDTO> paginatedList;
        if (start >= careerSimilarityList.size()) {
            // If start index is out of range, return an empty list
            paginatedList = Collections.emptyList();
        } else {
            // Ensure 'end' does not exceed the list size
            end = Math.min(end, careerSimilarityList.size());
            paginatedList = careerSimilarityList.subList(start, end);
        }
        return new PageImpl<>(paginatedList, pageable, careerSimilarityList.size());
    }

    private void sortCareerWithSimilarityScoreDTOBySkillLevel(List<CareerWithSimilarityScoreDTO> careerWithSimilarityScoreDTOList, CareerLevel preferedCareerLevel, Choice recommendationChoice, String sector){
        switch (recommendationChoice){
            case PATHWAY -> {
                careerWithSimilarityScoreDTOList.sort(Comparator.comparingInt(value -> {
                    CareerLevel careerLevel = value.getCareer().getCareerLevel();
                    if (careerLevel.toInt() >= preferedCareerLevel.toInt()) return Integer.MIN_VALUE;
                    return careerLevel.toInt();
                }));
                careerWithSimilarityScoreDTOList.removeIf(value -> !Objects.equals(value.getCareer().getSector(), sector));

            }
            case ASPIRATION -> {
                careerWithSimilarityScoreDTOList.sort(Comparator.comparingInt(value -> {
                    CareerLevel careerLevel = value.getCareer().getCareerLevel();
                    if (careerLevel.toInt() > preferedCareerLevel.toInt()) return Integer.MIN_VALUE;
                    return careerLevel.toInt();
                }));
            }
            case DIRECT_MATCH -> {
                careerWithSimilarityScoreDTOList.sort(Comparator.comparingInt(value -> {
                    CareerLevel careerLevel = value.getCareer().getCareerLevel();
                    if (careerLevel.toInt() == preferedCareerLevel.toInt()) return Integer.MIN_VALUE;
                    return careerLevel.toInt();
                }));
            }
            default -> {
                return;
            }
        }
    }

    // Help to map. userOrCareerSkills must be a list<UserSKills> or list<CareerSKills>
    private Parameters getCareerSimilarityWithPaginationHelper(Object userOrCareerSkills){
        Map<Long, SkillLevel> skillIdToSkillLevelMap = new HashMap<>();
        List<Long> skillsIdList;
        if(userOrCareerSkills instanceof List<?> ){ // Check whether userOrCareerSkills is a list
            List<?> list = (List<?>) userOrCareerSkills;
            if (!list.isEmpty() && list.get(0) instanceof CareerSkills) {
                List<CareerSkills> careerSkillsList = (List<CareerSkills>) list;
                for(CareerSkills careerSkill: careerSkillsList){
                    skillIdToSkillLevelMap.put(careerSkill.getSkill().getSkillId(), careerSkill.getProfiency());
                }
                skillsIdList = careerSkillsList.stream().map((careerSkill) -> careerSkill.getSkill().getSkillId()).toList();
                return new Parameters(skillIdToSkillLevelMap, skillsIdList);
            }
            else if(!list.isEmpty() && list.get(0) instanceof UserSkills){
                List<UserSkills> userSkills = (List<UserSkills>) userOrCareerSkills;
                for(UserSkills userSkill: userSkills){
                    skillIdToSkillLevelMap.put(userSkill.getSkill().getSkillId(), userSkill.getProfiency());
                }
                skillsIdList = userSkills.stream().map((careerSkill) -> careerSkill.getSkill().getSkillId()).toList();
                return new Parameters(skillIdToSkillLevelMap, skillsIdList);
            }
        }
        else{
            throw new RuntimeException("Bad use of getCareerSimilarityWithPaginationHelper");
        }
        return null;
>>>>>>> Stashed changes
    }

}
