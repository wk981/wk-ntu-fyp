package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.DashboardDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillWIthCareerLevelFlowDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.model.*;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import com.wgtpivotlo.wgtpivotlo.utils.SkillLevelHelper;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserService userService;
    private final CareerSkillAssociationService careerSkillAssociationService;
    private final SkillLevelHelper skillLevelHelper;

    public DashboardService(UserService userService, CareerSkillAssociationService careerSkillAssociationService, SkillLevelHelper skillLevelHelper) {
        this.userService = userService;
        this.careerSkillAssociationService = careerSkillAssociationService;
        this.skillLevelHelper = skillLevelHelper;
    }

    public DashboardDTO getUserDashboard(Authentication authentication) throws AccessDeniedException {
        Career userCareer = userService.getUserPreferenceCareer(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<Long> userSkillIdSet = new HashSet<>();
        long userId = userDetails.getId();

        List<UserSkills> userSkillsList = userService.getUserSkills(userId);
        List<CareerSkills> careerSkillsList = careerSkillAssociationService.findCareerSkillsByCareerId(userCareer.getCareerId());
        
        List<SkillWithProfiencyDTO> userSkillDTOList = userSkillsList.stream().map((userSkills) -> {
            Skill skill = userSkills.getSkill();
            userSkillIdSet.add(skill.getSkillId());
            return SkillWithProfiencyDTO
                    .builder()
                    .skillId(skill.getSkillId())
                    .name(skill.getName())
                    .pic(skill.getPic_url())
                    .description(skill.getDescription())
                    .profiency(userSkills.getProfiency())
                    .build();
        }).collect(Collectors.toList());

        double progression = 0;
        List<SkillWIthCareerLevelFlowDTO> skillGapList = new ArrayList<>();

        for(CareerSkills careerSkills: careerSkillsList) {
            Optional<UserSkills> tmp = Optional.empty(); // To mark whether user has that specific career skill
            for(UserSkills userSkills: userSkillsList){ // Calculate Completion
                if(userSkills.getSkill().getSkillId() == careerSkills.getSkill().getSkillId()){
                    tmp = Optional.of(userSkills);
                    progression += calculateProgression(userSkills.getProfiency().toInt(), careerSkills.getProfiency().toInt());
                }
             }

            List<String> skillFlow = skillLevelHelper.getSkillLevelFlow(tmp,careerSkills.getProfiency());
            Skill careerSkill = careerSkills.getSkill();
            SkillDTO skillDTO = SkillDTO.builder().skillId(careerSkill.getSkillId()).name(careerSkill.getName()).description(careerSkill.getDescription()).build();
            skillGapList.add(SkillWIthCareerLevelFlowDTO.builder().skillDTO(skillDTO).skillFlow(skillFlow).inSkillset(userSkillIdSet.contains(careerSkills.getSkill().getSkillId())).build());
        }


        return DashboardDTO
                .builder()
                .careerProgression(progression/careerSkillsList.size())
                .userSkills(userSkillDTOList)
                .careerTitle(userCareer.getTitle())
                .skillGap(skillGapList)
                .build();
    }

    private double calculateProgression(int userInt, int careerInt){
        long diff = Math.abs(careerInt - userInt);

        if (diff <= 0){
            return 1;
        }
        else if (diff == 1){
            return 0.5;
        }
        else{
            return 0.33;
        }
    }
}
