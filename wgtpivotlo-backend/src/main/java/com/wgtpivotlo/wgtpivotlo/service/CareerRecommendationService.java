package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.Choice;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.*;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.*;

class Parameters {
    private final Map<Long, SkillLevel> skillMap;
    private final List<Long> skillIds;

    Parameters(Map<Long, SkillLevel> skillMap, List<Long> careerIds) {
        this.skillMap = skillMap;
        this.skillIds = careerIds;
    }

    public Map<Long, SkillLevel> getSkillMap() { return skillMap; }
    public List<Long> getSkillIds() { return skillIds; }
}

@Slf4j
@Service
public class CareerRecommendationService {
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final CareerSkillAssociationService careerSkillAssociationService;
    private final UserService userService;

    @Autowired
    public CareerRecommendationService(CareerSkillAssociationRepository careerSkillAssociationRepository, CareerSkillAssociationService careerSkillAssociationService, UserService userService) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.careerSkillAssociationService = careerSkillAssociationService;
        this.userService = userService;
    }

    public PageDTO<CareerWithSimilarityScoreDTO> getRecommendedCareers(CareerRecommendationDTO request, Authentication authentication) throws AccessDeniedException {
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
        User user = userService.getUserByAuthentication(authentication);

        // To put into getCareerSimilarityWithPagination
        Parameters parameters;

        // This method can be used with career skill list
        if(request.getType() == Choice.CAREER){
            Optional<Long> existingCareerId = user.getCareerId().describeConstable();
            existingCareerId.orElseThrow(() -> new ResourceNotFoundException("User has not specify career"));

            Optional<List<CareerSkills>> existingCareerSkills = careerSkillAssociationRepository.findByCareerIdsNative(Collections.singletonList(existingCareerId.get()));
            existingCareerSkills.orElseThrow(() -> new ResourceNotFoundException("No skills found"));
            parameters = getCareerSimilarityWithPaginationHelper(existingCareerSkills.get());
        }

        // Since questionaire result updated userSkills, we can just extract the userSkills from there
        else{
            Optional<Long> existingCareerId = user.getCareerId().describeConstable();
            existingCareerId.orElseThrow(() -> new ResourceNotFoundException("User has not specify career"));
            List<UserSkills> userSkills = userService.getUserSkills(userId);
            parameters = getCareerSimilarityWithPaginationHelper(userSkills);
        }

        log.info("Making a query to get careers with similarity score");
        // Get all the career related to skills and profiency along with similarity score.
        Page<CareerWithSimilarityScoreDTO> result = getCareerSimilarityWithPagination(
                parameters.getSkillMap(),
                parameters.getSkillIds(),
                Optional.ofNullable(request.getCareerLevel()),
                Optional.ofNullable(request.getType()),
                Optional.ofNullable(request.getSector()),
                pageable
        );

        return mapping(correctedPageNumber, request.getPageNumber(),result);
    }

    public HashMap<String, PageDTO<CareerWithSimilarityScoreDTO>> getRecommendationExploreOtherCareer(com.wgtpivotlo.wgtpivotlo.dto.PageRequest request, Authentication authentication) throws AccessDeniedException {
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
        User user = userService.getUserByAuthentication(authentication);

        Optional<Long> existingCareerId = user.getCareerId().describeConstable();
        existingCareerId.orElseThrow(() -> new ResourceNotFoundException("User has not specify career"));

        List<UserSkills> userSkills = userService.getUserSkills(userId);
        Parameters userParameters = getCareerSimilarityWithPaginationHelper(userSkills);

        Optional<List<CareerSkills>> existingCareerSkills = careerSkillAssociationRepository.findByCareerIdsNative(Collections.singletonList(existingCareerId.get()));
        existingCareerSkills.orElseThrow(() -> new ResourceNotFoundException("No skills found"));
        Parameters careerParameters = getCareerSimilarityWithPaginationHelper(existingCareerSkills.get());

        Page<CareerWithSimilarityScoreDTO> userSkillsCareerRes = getCareerSimilarityWithPagination(userParameters.getSkillMap(),userParameters.getSkillIds(), Optional.empty(), Optional.empty(),Optional.empty(), pageable);
        Page<CareerWithSimilarityScoreDTO> careerSkillsCareerRes = getCareerSimilarityWithPagination(careerParameters.getSkillMap(), careerParameters.getSkillIds(), Optional.empty(), Optional.empty(),Optional.empty(), pageable);

        PageDTO<CareerWithSimilarityScoreDTO> userSkillsRecommendationMapping = mapping(correctedPageNumber, request.getPageNumber(),userSkillsCareerRes);
        PageDTO<CareerWithSimilarityScoreDTO> careerSkillsRecommendationMapping = mapping(correctedPageNumber, request.getPageNumber(), careerSkillsCareerRes);

        HashMap<String, PageDTO<CareerWithSimilarityScoreDTO>> res = new HashMap<>();
        res.put("user", userSkillsRecommendationMapping);
        res.put("career", careerSkillsRecommendationMapping);

        return res;
    }

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
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }
        return new PageDTO<>(res.getTotalPages(), pageNumber, res.getContent());
    }

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
            else if(!list.isEmpty() && list.get(0) instanceof SkillIdWithProfiencyDTO) {
                List<SkillIdWithProfiencyDTO> skillIdWithProfiencyDTOList = (List<SkillIdWithProfiencyDTO>)  userOrCareerSkills;
                for (SkillIdWithProfiencyDTO skillIdWithProfiencyDTO: skillIdWithProfiencyDTOList){
                    skillIdToSkillLevelMap.put(skillIdWithProfiencyDTO.getSkillId(), skillIdWithProfiencyDTO.getProfiency());
                }
                skillsIdList = skillIdWithProfiencyDTOList.stream().map(SkillIdWithProfiencyDTO::getSkillId).toList();
                return new Parameters(skillIdToSkillLevelMap, skillsIdList);
            }
        }
        else{
            throw new RuntimeException("Bad use of getCareerSimilarityWithPaginationHelper");
        }
        return null;
    }

}
