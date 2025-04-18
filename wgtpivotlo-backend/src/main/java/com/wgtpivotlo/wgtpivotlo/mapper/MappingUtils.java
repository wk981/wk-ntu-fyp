package com.wgtpivotlo.wgtpivotlo.mapper;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.model.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MappingUtils {
    public CourseWithSkillsDTO mapSkillsIntoCourse(Course course, List<CourseSkills> courseSkillsList){
        List<SkillDTO> skillDTOList = new ArrayList<>();
        SkillLevel profiency = null;

        for (CourseSkills courseSkills: courseSkillsList){
            Skill currentSkill = courseSkills.getSkill();
            SkillDTO skillDTO = new SkillDTO(currentSkill);
            skillDTOList.add(skillDTO);
            profiency = courseSkills.getProfiency();
        }

        CourseDTO courseDTO = new CourseDTO(course);
        return CourseWithSkillsDTO
                .builder()
                .skillDTOList(skillDTOList)
                .courseDTO(courseDTO)
                .profiency(profiency)
                .build();
    }

    public CareerWithSkillsDTO mapSkillsIntoCareer(Career career, List<CareerSkills> careerSkillsList, Boolean isAdmin){
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
        CareerWithSkillsDTO careerWithSkillsDTO = CareerWithSkillsDTO
                .builder()
                .skillsWithProfiency(careerSkillWithProficiencyDTOList)
                .career_id(career.getCareerId())
                .title(career.getTitle())
                .sector(career.getSector())
                .responsibility(career.getResponsibility())
                .careerLevel(career.getCareerLevel())
                .pic_url(career.getPic_url())
                .build();
        if(isAdmin){
            careerWithSkillsDTO.setCreated_on(career.getCreated_on());
            careerWithSkillsDTO.setUpdated_on(career.getUpdated_on());
        }
        return careerWithSkillsDTO;
    }

    public List<SkillDTO> mapCareerSkillsIntoSkillDTO(List<CareerSkills> careerSkillsList){
        return careerSkillsList.stream().map(careerSkills -> {
            Skill skill = careerSkills.getSkill();
            SkillDTO out = SkillDTO.builder().skillId(skill.getSkillId()).name(skill.getName()).pic("").build();
            return out;
        }).toList();
    }
}
