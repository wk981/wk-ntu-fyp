package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.model.UserSkills;
import com.wgtpivotlo.wgtpivotlo.repository.CareerRepository;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserSkillsRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.*;

@Service
@Slf4j
public class CourseRecommendationService {
    private final UserSkillsRepository userSkillsRepository;
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final CareerRepository careerRepository;
    private static List<SkillLevel> skillLevelList = Arrays.asList(
            SkillLevel.Beginner,
            SkillLevel.Intermediate,
            SkillLevel.Advanced
    );

    @Autowired
    public CourseRecommendationService(UserSkillsRepository userSkillsRepository, CareerSkillAssociationRepository careerSkillAssociationRepository, CareerRepository careerRepository) {
        this.userSkillsRepository = userSkillsRepository;
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.careerRepository = careerRepository;
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
        List<CareerSkills> careerSkillsList = careerSkillAssociationRepository.findByCareerIdsNative(Collections.singletonList(career.getCareerId()));

        HashMap<Long, List<SkillLevel>> skillsToLevelMap = new HashMap<>();

        for (UserSkills userSkills: userSkillsList){
            Skill userSkill = userSkills.getSkill();
            SkillLevel userSkillLevel = userSkills.getProfiency();
            for(CareerSkills careerSkills: careerSkillsList){
                Skill careerSkill = careerSkills.getSkill();
                SkillLevel careerSkillLevel = careerSkills.getProfiency();
                List<SkillLevel> temp = new ArrayList<>();
                if (userSkill.getSkillId() == careerSkill.getSkillId()){
                    for (int i = userSkillLevel.toInt() + 1; i <= careerSkillLevel.toInt(); i++) {
                        temp.add(skillLevelList.get(i - 1)); // Adjust for zero-based indexing
                    }
                }
                else{
                    for(int i = 1; i <= careerSkillLevel.toInt(); i++){
                        temp.add(skillLevelList.get(i-1));
                    }
                }
                skillsToLevelMap.put(careerSkill.getSkillId(),temp);
            }
        }
        HashMap<String, String> res = new HashMap<>();
        res.put("data", skillsToLevelMap.toString());
        return res;
    }
}
