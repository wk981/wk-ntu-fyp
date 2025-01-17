package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.CourseDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CourseWithSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.service.CourseRecommendationService;
import com.wgtpivotlo.wgtpivotlo.service.CourseSkillAssociationService;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/course-skill-association")
public class CourseSkillAssociationController {
    private final CourseSkillAssociationService courseSkillAssociationService;
    private final CourseRecommendationService courseRecommendationService;

    public CourseSkillAssociationController(CourseSkillAssociationService courseSkillAssociationService, CourseRecommendationService courseRecommendationService) {
        this.courseSkillAssociationService = courseSkillAssociationService;
        this.courseRecommendationService = courseRecommendationService;
    }

    @GetMapping("/courses/{course_id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long course_id) {
        Optional<CourseWithSkillsDTO> res = courseSkillAssociationService.findByCourseId(course_id);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/courses")
    public ResponseEntity<PageDTO<CourseDTO>> getPaginatedCoursesBySkill(
            @RequestParam(required = true) long skillId,
            @RequestParam(defaultValue = "1") @Min(1) int pageNumber,
            @RequestParam(defaultValue = "10") @Min(1) int pageSize) {

        return ResponseEntity.ok(courseSkillAssociationService.findPaginatedCourseBySkillId(skillId, pageNumber, pageSize));
    }


    @PostMapping("/course/learning-timeline")
    public ResponseEntity<HashMap<String,String>> getLearningTimeLine(Authentication authentication) throws AccessDeniedException {
        return ResponseEntity.ok(courseRecommendationService.recommendCoursesBasedOnUserSkills(authentication));
    }


}
