package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CourseDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CourseWithStatusDTO;
import com.wgtpivotlo.wgtpivotlo.dto.EditUserCourseStatusDTO;
import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.model.UserCourseHistory;
import com.wgtpivotlo.wgtpivotlo.repository.CourseRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserCourseHistoryRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
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

    public UserCourseHistoryService(UserCourseHistoryRepository userCourseHistoryRepository, CourseRepository courseRepository, UserRepository userRepository, UserService userService) {
        this.userCourseHistoryRepository = userCourseHistoryRepository;
        this.courseRepository = courseRepository;
        this.userService = userService;
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
            newEntry = UserCourseHistory.builder().userHistoryId(existingCourseHistory.get().getUserHistoryId()).user(user).course(existingCourse.get()).courseStatus(courseStatus).build();
        }
        else{
            newEntry = UserCourseHistory.builder().user(user).course(existingCourse.get()).courseStatus(courseStatus).build();
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
            CourseDTO courseDTO = new CourseDTO(course);
            return CourseWithStatusDTO.builder().courseDTO(courseDTO).courseStatus(userCourse.getCourseStatus()).build();
        }).toList();

        return Optional.of(res);
    }
}
