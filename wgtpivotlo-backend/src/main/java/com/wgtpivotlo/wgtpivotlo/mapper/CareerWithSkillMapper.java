package com.wgtpivotlo.wgtpivotlo.mapper;

import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSkillDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CareerWithSkillMapper {
    public CareerWithSkillDTO mapSkillsIntoCareer(Career career, List<CareerSkills> careerSkillsList){
        List<SkillWithProfiencyDTO> careerSkillWithProficiencyDTOList = new ArrayList<>();

        for (CareerSkills careerSkills: careerSkillsList){
            SkillWithProfiencyDTO skillWithProfiencyDTO
                    = SkillWithProfiencyDTO
                    .builder()
                    .skillId(careerSkills.getSkill().getSkillId())
                    .name(careerSkills.getSkill().getName())
                    .description(careerSkills.getSkill().getDescription())
                    .pic(careerSkills.getSkill().getPic_url())
                    .profiency(careerSkills.getProfiency())
                    .build();
            careerSkillWithProficiencyDTOList.add(skillWithProfiencyDTO);
        }

        return CareerWithSkillDTO
            .builder()
            .skillsWithProfiency(careerSkillWithProficiencyDTOList)
            .career_id(career.getCareer_id())
            .title(career.getTitle())
            .sector(career.getSector())
            .responsibility(career.getResponsibility())
            .careerLevel(career.getCareerLevel())
            .pic_url(career.getPic_url())
            .build();
    }
}
