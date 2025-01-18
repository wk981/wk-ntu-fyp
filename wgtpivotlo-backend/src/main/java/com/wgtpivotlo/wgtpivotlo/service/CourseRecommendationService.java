package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CourseDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CourseWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CourseWithSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.*;
import com.wgtpivotlo.wgtpivotlo.repository.*;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CourseRecommendationService {
    private final UserSkillsRepository userSkillsRepository;
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final CareerRepository careerRepository;
    private final CourseRepository courseRepository;
    private static List<SkillLevel> skillLevelList = Arrays.asList(
            SkillLevel.Beginner,
            SkillLevel.Intermediate,
            SkillLevel.Advanced
    );

    @Autowired
    public CourseRecommendationService(UserSkillsRepository userSkillsRepository, CareerSkillAssociationRepository careerSkillAssociationRepository, CareerRepository careerRepository, CourseRepository courseRepository) {
        this.userSkillsRepository = userSkillsRepository;
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.careerRepository = careerRepository;
        this.courseRepository = courseRepository;
    }

    public HashMap<String, String> recommendCoursesBasedOnUserSkills(Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }

        log.info("Step 1: Get UserId and preference career");
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();
        Optional<Career> existingPreferranceCareer = careerRepository.findUserCareer(userId);
        existingPreferranceCareer.orElseThrow(() -> new ResourceNotFoundException("User has not select a preference career"));
        Career career = existingPreferranceCareer.get();

        log.info("Step 2: Get User's Skills");
        Optional<List<UserSkills>> existingUserSkills = userSkillsRepository.findByUserId(userId);
        existingUserSkills.orElseThrow(() -> new ResourceNotFoundException("User has not done questionaire."));
        List<UserSkills> userSkillsList = existingUserSkills.get();

        log.info("Step 3: Get career skills");
        Optional<List<CareerSkills>> existingCareerSkillsList = careerSkillAssociationRepository.findByCareerIdsNative(Collections.singletonList(career.getCareerId()));
        existingCareerSkillsList.orElseThrow(() -> new ResourceNotFoundException("No skills found for that career"));
        HashMap<Long, List<SkillLevel>> skillsToLevelMap = new HashMap<>();

        for (UserSkills userSkills: userSkillsList){
            Skill userSkill = userSkills.getSkill();
            SkillLevel userSkillLevel = userSkills.getProfiency();
            for(CareerSkills careerSkills: existingCareerSkillsList.get()){
                Skill careerSkill = careerSkills.getSkill();
                SkillLevel careerSkillLevel = careerSkills.getProfiency();
                List<SkillLevel> temp = getSkillLevelProcedure(userSkill.getSkillId(), careerSkill.getSkillId(), userSkillLevel.toInt(), careerSkillLevel.toInt());
                skillsToLevelMap.put(careerSkill.getSkillId(),temp);
            }
        }
        HashMap<String, String> res = new HashMap<>();
        res.put("data", skillsToLevelMap.toString());
        return res;
    }

    public PageDTO<CourseWithProfiencyDTO> findPaginatedTimelineCourseBySkillId(long skillId, long careerId, int pageNumber, int pageSize, Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }

        log.info("Step 1: Get UserId");
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();

        log.info("Step 2: Check whether skillId exists for user");
        Optional<UserSkills> existingUserSkill = userSkillsRepository.findByUserIdAndSkillId(userId,skillId);

        log.info("Step 3: Get Skill Level for the career");
        Optional<CareerSkills> existCareerSkills =  careerSkillAssociationRepository.findCareerSkillsByCareerIdAndSkillId(careerId,skillId);
        existCareerSkills.orElseThrow(() -> new ResourceNotFoundException("No skill found for career"));
        SkillLevel careerSkillLevel = existCareerSkills.get().getProfiency();

        List<String> recommendedSkillLevelsFlow = new ArrayList<>();
        if (existingUserSkill.isPresent()) {
            // Get user's current proficiency index
            int currentProficiencyIndex = existingUserSkill.get().getProfiency().toInt() - 1;

            // Get career's required proficiency level index
            int careerProficiencyIndex = skillLevelList.indexOf(careerSkillLevel);

            // Ensure the current proficiency is valid
            if (currentProficiencyIndex < skillLevelList.size()) {
                // Add all levels from current proficiency to career's required level
                for (int i = currentProficiencyIndex; i <= careerProficiencyIndex && i < skillLevelList.size(); i++) {
                    recommendedSkillLevelsFlow.add(skillLevelList.get(i).toString());
                }
            } else {
                // Already at max level, suggest the highest level
                recommendedSkillLevelsFlow.add(skillLevelList.get(currentProficiencyIndex).toString());
            }
        } else {
            // Default for new users: Start from Beginner to the career's required level
            int careerProficiencyIndex = skillLevelList.indexOf(careerSkillLevel);
            for (int i = 0; i <= careerProficiencyIndex && i < skillLevelList.size(); i++) {
                recommendedSkillLevelsFlow.add(skillLevelList.get(i).toString());
            }
        }

        int correctedPageNumber = (pageNumber > 0) ? pageNumber - 1 : 0;
        Pageable skillPageWithElements = PageRequest.of(correctedPageNumber, pageSize, Sort.by("rating").descending());

        log.info("Step 4: Making a query to get course based on skillId and skill level flow");
        Page<Object[]> paginatedCourses = courseRepository.findByCourseBySkillIdSortedByProficiency(skillId, recommendedSkillLevelsFlow, skillPageWithElements);

        List<CourseWithProfiencyDTO> courseWithProfiencyDTOS = (List<CourseWithProfiencyDTO>) paginatedCourses.getContent().stream().map((objects -> (CourseWithProfiencyDTO) CourseWithProfiencyDTO.builder()
                .course_id((Long) objects[0])             // course_id (long)
                .name((String) objects[1])               // name (String)
                .link((String) objects[2])               // link (String)
                .rating((Double) objects[3])              // rating (float)
                .reviews_counts((Double) objects[4])      // reviews_counts (float)
                .courseSource((String) objects[7])       // courseSource (String)
                .profiency((String) objects[8])          // profiency (String)
                .build()))
        .toList();

        if (correctedPageNumber >= paginatedCourses.getTotalPages()) {
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        log.info("Step 5: Tidying up body and pagination");
        return new PageDTO<>(paginatedCourses.getTotalPages(), pageNumber, courseWithProfiencyDTOS);
    }

    private List<SkillLevel> getSkillLevelProcedure(long userSkillId,long careerSkillId, int userSkillInt, int careerSkillInt) {
        List<SkillLevel> temp = new ArrayList<>();
        int index = 1;
        if (userSkillId == careerSkillId){
            index = userSkillInt;
        }
        for (int i = index; i <= careerSkillInt; i++) {
            temp.add(skillLevelList.get(i - 1)); // Adjust for zero-based indexing
        }
        return temp;
    }
}
