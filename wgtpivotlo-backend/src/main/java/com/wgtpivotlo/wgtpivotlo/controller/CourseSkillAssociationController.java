package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.service.CourseRecommendationService;
import com.wgtpivotlo.wgtpivotlo.service.CourseSkillAssociationService;
import com.wgtpivotlo.wgtpivotlo.service.UserCourseHistoryService;
import jakarta.validation.constraints.Min;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/course-skill-association")
public class CourseSkillAssociationController {
    private final CourseSkillAssociationService courseSkillAssociationService;
    private final CourseRecommendationService courseRecommendationService;
    private final UserCourseHistoryService userCourseHistoryService;

    public CourseSkillAssociationController(CourseSkillAssociationService courseSkillAssociationService, CourseRecommendationService courseRecommendationService, UserCourseHistoryService userCourseHistoryService) {
        this.courseSkillAssociationService = courseSkillAssociationService;
        this.courseRecommendationService = courseRecommendationService;
        this.userCourseHistoryService = userCourseHistoryService;
    }

    @PostMapping("/")
    public ResponseEntity<MessageDTO> addCourseSkill(@RequestBody CourseSkillsDTO courseSkillsDTO) throws BadRequestException {
        courseSkillAssociationService.addCourseSkill(courseSkillsDTO);
        MessageDTO messageDTO = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(messageDTO);
    }

    @PutMapping("/")
    public ResponseEntity<MessageDTO> editCourseSkill(@RequestBody CourseSkillsDTO courseSkillsDTO) throws BadRequestException {
        courseSkillAssociationService.editCourseSkill(courseSkillsDTO);
        MessageDTO messageDTO = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(messageDTO);
    }

    @DeleteMapping("/")
    public ResponseEntity<MessageDTO> deleteCourseSkill(@RequestBody CourseSkillsDTO courseSkillsDTO) throws BadRequestException {
        courseSkillAssociationService.deleteCourseSkill(courseSkillsDTO);
        MessageDTO messageDTO = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(messageDTO);
    }

    @GetMapping("/courses/{course_id}")
    public ResponseEntity<CourseWithSkillsDTO> getCourseById(@PathVariable Long course_id) {
        CourseWithSkillsDTO res = courseSkillAssociationService.findByCourseId(course_id);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/courses/change-status")
    public ResponseEntity<?> editUserCourseStatus(@RequestBody EditUserCourseStatusDTO request, Authentication authentication) throws AccessDeniedException{
        userCourseHistoryService.editCourseStatusWithUserID(request,authentication);
        return ResponseEntity.ok("success");
    }

    @PutMapping("/courses/delete-status/{course_id}")
    public ResponseEntity<?> deleteUserCourseStatus(@PathVariable Long course_id, Authentication authentication) throws AccessDeniedException{
        userCourseHistoryService.deleteCourseStatusWithUserId(course_id,authentication);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/courses")
    public ResponseEntity<PageDTO<CourseDTO>> getPaginatedCoursesBySkill(
            @RequestParam(required = true) long skillId,
            @RequestParam(defaultValue = "1") @Min(1) int pageNumber,
            @RequestParam(defaultValue = "10") @Min(1) int pageSize) {

        return ResponseEntity.ok(courseSkillAssociationService.findPaginatedCourseBySkillId(skillId, pageNumber, pageSize));
    }

    @GetMapping("/courses/timeline")
    public ResponseEntity<HashMap<String, Object>> getPaginatedTimelineCoursesBySkill(
            @RequestParam(required = true) long skillId,
            @RequestParam(required = true) long careerId,
            @RequestParam(required = false) Optional<SkillLevel> skillLevelFilter,
            @RequestParam(defaultValue = "1")@Min(1) int pageNumber,
            @RequestParam(defaultValue = "10") @Min(1) int pageSize,
            Authentication authentication) throws AccessDeniedException {

        return ResponseEntity.ok(courseRecommendationService.findPaginatedTimelineCourseBySkillId(skillId, careerId, skillLevelFilter, pageNumber, pageSize, authentication));
    }

    @GetMapping("/courses/history")
    public ResponseEntity<Optional<List<CourseWithStatusDTO>>> getUserCourseHistory(
            @RequestParam(required = false) SkillLevel skillLevel,
            @RequestParam(required = false) CourseStatus courseStatus,
            Authentication authentication) throws AccessDeniedException {
        return ResponseEntity.ok(userCourseHistoryService.getUserCourseHistory(authentication, skillLevel, courseStatus));
    }

}
