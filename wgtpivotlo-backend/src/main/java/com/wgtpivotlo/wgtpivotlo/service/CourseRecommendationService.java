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
import com.wgtpivotlo.wgtpivotlo.utils.SkillLevelHelper;
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
    private final SkillLevelHelper skillLevelHelper;

    @Autowired
    public CourseRecommendationService(UserSkillsRepository userSkillsRepository, CareerSkillAssociationRepository careerSkillAssociationRepository, CareerRepository careerRepository, CourseRepository courseRepository, SkillLevelHelper skillLevelHelper) {
        this.userSkillsRepository = userSkillsRepository;
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.careerRepository = careerRepository;
        this.courseRepository = courseRepository;
        this.skillLevelHelper = skillLevelHelper;
    }

    public HashMap<String, Object> findPaginatedTimelineCourseBySkillId(long skillId, long careerId, Optional<SkillLevel> skillLevelFilter, int pageNumber, int pageSize, Authentication authentication) throws AccessDeniedException {
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

        List<String> recommendedSkillLevelsFlow = skillLevelHelper.getSkillLevelFlow(existingUserSkill, careerSkillLevel);

        int correctedPageNumber = (pageNumber > 0) ? pageNumber - 1 : 0;
        Pageable skillPageWithElements = PageRequest.of(correctedPageNumber, pageSize, Sort.by("rating").descending());
        Optional<String> filterBySkillLevel = skillLevelFilter.map(Object::toString);


        log.info("Step 4: Making a query to get course based on skillId and skill level flow");
        Page<Object[]> paginatedCourses = courseRepository.findByCourseBySkillIdSortedByProficiency(skillId, recommendedSkillLevelsFlow, filterBySkillLevel,skillPageWithElements);

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
        HashMap<String, Object> res = new HashMap<>();
        res.put("pageDTO", new PageDTO<>(paginatedCourses.getTotalPages(), pageNumber, courseWithProfiencyDTOS));
        res.put("availableSkillLevels", recommendedSkillLevelsFlow);
        return res;
    }

}
