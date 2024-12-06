package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.CourseWithSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.service.CourseSkillAssociationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/course-skill-association")
public class CourseSkillAssociationController {
    private final CourseSkillAssociationService courseSkillAssociationService;

    public CourseSkillAssociationController(CourseSkillAssociationService courseSkillAssociationService) {
        this.courseSkillAssociationService = courseSkillAssociationService;
    }

    @GetMapping("/course/{course_id}")
    public ResponseEntity<?> getCareerAssiocationId(@PathVariable Long course_id){
        Optional<CourseWithSkillsDTO> res = courseSkillAssociationService.findByCourseId(course_id);
        return ResponseEntity.ok(res);
    }
}
