package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.model.UserCourseHistory;
import com.wgtpivotlo.wgtpivotlo.repository.CourseRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserCourseHistoryRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserSkillsRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserCourseHistoryService {
    private final UserCourseHistoryRepository userCourseHistoryRepository;
    private final CourseRepository courseRepository;
    private final UserService userService;
    private final CourseSkillAssociationService courseSkillAssociationService;

    public UserCourseHistoryService(UserCourseHistoryRepository userCourseHistoryRepository, CourseRepository courseRepository, UserRepository userRepository, UserService userService, CourseSkillAssociationService courseSkillAssociationService, UserSkillsRepository userSkillsRepository) {
        this.userCourseHistoryRepository = userCourseHistoryRepository;
        this.courseRepository = courseRepository;
        this.userService = userService;
        this.courseSkillAssociationService = courseSkillAssociationService;
    }

    @Transactional
    public void editCourseStatusWithUserID(EditUserCourseStatusDTO request, Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }
        long courseId = request.getCourseId();
        CourseStatus courseStatus = request.getCourseStatus();

        // Get userId
        log.info("Step 1: Get UserId");
        User user = userService.getUser(authentication);

        // Check if course id is valid
        log.info("Step 2: Check if course is valid");
        Optional<Course> existingCourse = courseRepository.findById(courseId);
        existingCourse.orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Check existing
        Optional<UserCourseHistory> existingCourseHistory = userCourseHistoryRepository.findByUserIdAndCourseId(user.getUser_id(),courseId);
        UserCourseHistory newEntry;
        if (existingCourseHistory.isPresent()){
            UserCourseHistory userCourseHistory = existingCourseHistory.get();
            // update course status in course history
            newEntry = UserCourseHistory.builder().userHistoryId(userCourseHistory.getUserHistoryId()).user(user).course(existingCourse.get()).courseStatus(courseStatus).build();
        }
        else{
            // create new entry in course history
            newEntry = UserCourseHistory.builder().user(user).course(existingCourse.get()).courseStatus(courseStatus).build();
        }

        if (request.getCourseStatus() == CourseStatus.COMPLETED){
            // Course complete, update user skill to updated or add new skills
            log.info("Step 2a: Course Completed!");
            CourseWithSkillsDTO courseWithSkillsDTO = courseSkillAssociationService.findByCourseId(request.getCourseId());
            List<SkillDTO> skillDTOList = courseWithSkillsDTO.getSkillDTOList();
            SkillLevel courseProfiency = courseWithSkillsDTO.getProfiency();
            for(SkillDTO skillDTO: skillDTOList){
                userService.updateOrAddUserSkill(user.getUser_id(), skillDTO.getSkillId(), courseProfiency);
            }
        }
        // Find the course in user course history using course Id
        log.info("Step 3: Insert course status");
        userCourseHistoryRepository.save(newEntry);
    }

    @Transactional
    public void deleteCourseStatusWithUserId(long courseId, Authentication authentication) throws AccessDeniedException{
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }

        // Get userId
        log.info("Step 1: Get UserId");
        User user = userService.getUser(authentication);

        // Check if course id is valid
        log.info("Step 2: Check if course is valid");
        Optional<Course> existingCourse = courseRepository.findById(courseId);
        existingCourse.orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Check existing
        Optional<UserCourseHistory> existingCourseHistory = userCourseHistoryRepository.findByUserIdAndCourseId(user.getUser_id(),courseId);
        existingCourseHistory.ifPresentOrElse(
                userCourseHistory -> {
                    log.info("Step 3: Deleting");
                    userCourseHistoryRepository.deleteById(userCourseHistory.getUserHistoryId());
                },
                () ->{
                    return ;
                }
        );

    }

    public Optional<List<CourseWithStatusDTO>> getUserCourseHistory(Authentication authentication) throws AccessDeniedException {
        // Get userId
        log.info("Step 1: Get UserId");
        User user = userService.getUser(authentication);

        Optional<List<UserCourseHistory>> existingCourseHistory = userCourseHistoryRepository.findByUser(user);
        List<CourseWithStatusDTO> res = existingCourseHistory.get().stream().map((userCourse) -> {
            Course course = userCourse.getCourse();
            CourseWithSkillsDTO courseWithSkillsDTO = courseSkillAssociationService.findByCourseId(course.getCourse_id());
            CourseWithProfiencyDTO courseWithProfiencyDTO = new CourseWithProfiencyDTO(course, courseWithSkillsDTO.getProfiency().toString());
            return CourseWithStatusDTO.builder().courseWithProfiencyDTO(courseWithProfiencyDTO).courseStatus(userCourse.getCourseStatus()).build();
        }).toList();

        return Optional.of(res);
    }
}
