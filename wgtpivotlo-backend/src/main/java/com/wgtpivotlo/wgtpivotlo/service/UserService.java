package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final CareerRepository careerRepository;
    private final UserSkillsRepository userSkillsRepository;

    @Autowired
    public UserService(UserRepository userRepository, CareerRepository careerRepository, UserSkillsRepository userSkillsRepository) {
        this.userRepository = userRepository;
        this.careerRepository = careerRepository;
        this.userSkillsRepository = userSkillsRepository;
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
        Optional<Long> existingCareerId = Optional.ofNullable(getUser(authentication).getCareerId());
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

    public User getUser(Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }
        log.info("Step 1: Getting User");
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();
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

}
