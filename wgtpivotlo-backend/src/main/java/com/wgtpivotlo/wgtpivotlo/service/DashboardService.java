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
        User user = userService.getUserByAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();

        List<UserSkills> userSkillsList = userService.getUserSkills(userId);
        List<CareerSkills> careerSkillsList = careerSkillAssociationService.findCareerSkillsByCareerId(userCareer.getCareerId());
        
        List<SkillWithProfiencyDTO> userSkillDTOList = userSkillsList.stream().map((userSkills) -> {
            Skill skill = userSkills.getSkill();
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
            Optional<UserSkills> tmp = Optional.ofNullable(null);
            for(UserSkills userSkills: userSkillsList){
                if(userSkills.getSkill().getSkillId() == careerSkills.getSkill().getSkillId()){
                    tmp = Optional.of(userSkills);
                    SkillLevel userSkillLevel = userSkills.getProfiency();
                    double userSkillLevelWeightage = userSkillLevel.toWeightedDouble();
                    progression += userSkillLevelWeightage;
                }
             }
            List<String> skillFlow = skillLevelHelper.getSkillLevelFlow(tmp,careerSkills.getProfiency());
            Skill careerSkill = careerSkills.getSkill();
            SkillDTO skillDTO = SkillDTO.builder().skillId(careerSkill.getSkillId()).name(careerSkill.getName()).description(careerSkill.getDescription()).build();

            skillGapList.add(SkillWIthCareerLevelFlowDTO.builder().skillDTO(skillDTO).skillFlow(skillFlow).build());
        }


        return DashboardDTO
                .builder()
                .username(user.getUsername())
                .pic(user.getPic())
                .careerProgression(progression/careerSkillsList.size())
                .userSkills(userSkillDTOList)
                .career(userCareer)
                .skillGap(skillGapList)
                .build();
    }
}
