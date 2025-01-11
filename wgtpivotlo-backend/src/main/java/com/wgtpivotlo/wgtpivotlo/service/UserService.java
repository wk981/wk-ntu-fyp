package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.repository.CareerRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Optional;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final CareerRepository careerRepository;

    @Autowired
    public UserService(UserRepository userRepository, CareerRepository careerRepository) {
        this.userRepository = userRepository;
        this.careerRepository = careerRepository;
    }

    @Transactional
    public void setCareerPreference(long careerId, Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }
        // Check if career exists
        log.info("Step 1: Checking for Career");
        Optional<Career> existingCareer = careerRepository.findById(careerId);
        existingCareer.orElseThrow(() -> new ResourceNotFoundException("Career is not found"));

        log.info("Step 2: Getting User");
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();
        Optional<User> existingUser = userRepository.findById(userId);
        existingUser.orElseThrow(() -> new ResourceNotFoundException("User is not found"));

        log.info("Step 3: Setting career preference");
        User user = existingUser.get();
        user.setCareerId(careerId);
        userRepository.save(user);
    }
}
