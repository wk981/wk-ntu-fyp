package com.wgtpivotlo.wgtpivotlo.utils;

import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.model.UserSkills;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class SkillLevelHelper {
    public static List<SkillLevel> skillLevelList = Arrays.asList(
            SkillLevel.Beginner,
            SkillLevel.Intermediate,
            SkillLevel.Advanced
    );
    public List<String> getSkillLevelFlow(Optional<UserSkills> userSkill, SkillLevel careerSkillLevel){
        List<String> recommendedSkillLevelsFlow = new ArrayList<>();
        if (userSkill.isPresent()) {
            // Get user's current proficiency index
            int currentProficiencyIndex = userSkill.get().getProfiency().toInt() - 1;

            // Get career's required proficiency level index
            int careerProficiencyIndex = skillLevelList.indexOf(careerSkillLevel);

            // Ensure the current proficiency is valid
            if (currentProficiencyIndex < skillLevelList.size()) {
                // Add all levels from current proficiency to career's required level
                for (int i = currentProficiencyIndex; i <= careerProficiencyIndex && i < skillLevelList.size(); i++) {
                    recommendedSkillLevelsFlow.add(skillLevelList.get(i).toString());
                }
            } else {
                // Already at max level, suggest the highest level
                recommendedSkillLevelsFlow.add(skillLevelList.get(currentProficiencyIndex).toString());
            }
        } else {
            // Default for new users: Start from Beginner to the career's required level
            int careerProficiencyIndex = skillLevelList.indexOf(careerSkillLevel);
            for (int i = 0; i <= careerProficiencyIndex && i < skillLevelList.size(); i++) {
                recommendedSkillLevelsFlow.add(skillLevelList.get(i).toString());
            }
        }
        return recommendedSkillLevelsFlow;
    }
}
