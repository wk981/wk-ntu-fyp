package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.UserUpdatePasswordRequest;
import com.wgtpivotlo.wgtpivotlo.dto.UserUpdateRequest;
import com.wgtpivotlo.wgtpivotlo.enums.Role;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.DuplicateException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.InvalidPasswordException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.model.UserSkills;
import com.wgtpivotlo.wgtpivotlo.repository.CareerRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserSkillsRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final CareerRepository careerRepository;
    private final UserSkillsRepository userSkillsRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserService(UserRepository userRepository, CareerRepository careerRepository, UserSkillsRepository userSkillsRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.careerRepository = careerRepository;
        this.userSkillsRepository = userSkillsRepository;
        this.passwordEncoder = passwordEncoder;
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

        User user = existingUser.get();
        Optional<Long> existingCareerId = Optional.ofNullable(existingUser.get().getCareerId());
        if (existingCareerId.isPresent() && user.getCareerId() == careerId){
            log.info("Same Career, no change");
            return;
        }
        else{
            log.info("Step 3: Setting career preference");
            user.setCareerId(careerId);
            userRepository.save(user);
        }

    }

    public Career getUserPreferenceCareer(Authentication authentication) throws AccessDeniedException {
        Optional<Long> existingCareerId = Optional.ofNullable(getUserByAuthentication(authentication).getCareerId());
        existingCareerId.orElseThrow(() -> new ResourceNotFoundException("User has set a preference career"));

        Optional<Career> existingCareer = careerRepository.findById(existingCareerId.get());
        existingCareer.orElseThrow(() -> new ResourceNotFoundException("Career is not found"));
        return existingCareer.get();
    }

    public List<UserSkills> getUserSkills(long userId){
        Optional<List<UserSkills>> existingUserSkill = userSkillsRepository.findByUserId(userId);
        existingUserSkill.orElseThrow(() -> new ResourceNotFoundException("User does not have skills"));
        return existingUserSkill.get();
    }

    public User getUserByAuthentication(Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }
        log.info("Step 1: Getting User");
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();
        return getUserByUserId(userId);

    }

    public User getUserByUserId(long userId){
        Optional<User> existingUser = userRepository.findById(userId);
        existingUser.orElseThrow(() -> new ResourceNotFoundException("User is not found"));
        return existingUser.get();
    }

    @Transactional
    public void updateUserSkillProfiency(long userId, long skillId, SkillLevel skillLevel){
        userSkillsRepository.updateByUserIdAndSkillIdAndProfiency(userId,skillId,skillLevel.toString());
    }

    @Transactional
    public void addNewUserSkill(long userId, long skillId, SkillLevel skillLevel){
        userSkillsRepository.insertByUserIdAndSkillIdAndProfiency(userId,skillId,skillLevel.toString());
    }

    @Transactional
    public void updateOrAddUserSkill(long userId, long skillId, SkillLevel skillLevel){
        Optional<UserSkills> existingUserSkill = userSkillsRepository.findByUserIdAndSkillId(userId, skillId);
        if (existingUserSkill.isPresent()){
            int currentProfiency = existingUserSkill.get().getProfiency().toInt();
            int newProfiency = skillLevel.toInt();
            if (newProfiency > currentProfiency) { // Only update if strictly higher
                log.info("Updating user's skill proficiency");
                updateUserSkillProfiency(userId, skillId, skillLevel);
            }
            else {
                log.info("User already has this skill at the same or higher level, no update needed.");
            }
        }
        else{
            log.info("Insert a new user's skill");
            addNewUserSkill(userId,skillId,skillLevel);
        }
    }

    @Transactional
    public void updateUser(UserUpdateRequest request, Authentication authentication) throws AccessDeniedException {
        validateUserAccess(request.getUserId(), authentication);

        LocalDateTime updatedTime = null;
        User user = getUserByUserId(request.getUserId());

        if(request.getNewEmail() != null && !request.getNewEmail().isEmpty()){
            String newEmail = request.getNewEmail();
            if (Objects.equals(newEmail, user.getEmail())){
                throw new DuplicateException("Same email");
            }
            Optional<User> existingEmail = userRepository.findByEmail(newEmail);
            if(existingEmail.isPresent()){
                throw new DuplicateException(newEmail + " has been taken");
            }
            user.setEmail(request.getNewEmail());
            updatedTime = LocalDateTime.now(); // update to current time
        }

        if(request.getNewUsername() != null && !request.getNewUsername().isEmpty()){
            String newUsername = request.getNewUsername();
            if (Objects.equals(newUsername, user.getUsername())){
                throw new DuplicateException("Same username");
            }
            Optional<User> existingEmail = userRepository.findByUsername(newUsername);
            if(existingEmail.isPresent()){
                throw new DuplicateException(newUsername + " has been taken");
            }
            user.setUsername(request.getNewUsername());
            updatedTime = LocalDateTime.now(); // update to current time
        }

        if (updatedTime != null) {
            user.setUpdated_on(updatedTime);
        }

        userRepository.save(user);
    }

    @Transactional
    public void updatePassword(UserUpdatePasswordRequest request, Authentication authentication) throws AccessDeniedException, BadRequestException {
        validateUserAccess(request.getUserId(), authentication);
        User user = getUserByUserId(request.getUserId());

        if (!Objects.equals(request.getNewPassword(), request.getConfirmNewPassword())){
            throw new BadRequestException("Password does not match");
        }

        String encryptedNewPassword = passwordEncoder.encode(request.getNewPassword());

        // Check if the current password entered is correct.
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Your current password is incorrect. Please enter the correct current password to change it.");
        }

        // Check if the new password is the same as the current (stored) password.
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new DuplicateException("Your new password cannot be the same as your current password.");
        }


        user.setPassword(encryptedNewPassword);
        user.setUpdated_on(LocalDateTime.now());
        userRepository.save(user);
    }

    private void validateUserAccess(long userId, Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long sessionUserId = userDetails.getId();
        Role userRole = userDetails.getRole();

        if(sessionUserId != userId && userRole != Role.ADMIN){
            throw new AccessDeniedException("Access Denied");
        }

    }

}
