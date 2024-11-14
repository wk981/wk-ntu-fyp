package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CourseDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CourseSkillDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.model.CourseSkills;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.repository.CourseRepository;
import com.wgtpivotlo.wgtpivotlo.repository.CourseSkillAssociationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CourseSkillAssociationService {
    private final CourseRepository courseRepository;
    private final CourseSkillAssociationRepository courseSkillAssociationRepository;

    @Autowired
    public CourseSkillAssociationService(CourseRepository courseRepository, CourseSkillAssociationRepository courseSkillAssociationRepository) {
        this.courseRepository = courseRepository;
        this.courseSkillAssociationRepository = courseSkillAssociationRepository;
    }

    public Optional<CourseSkillDTO> findByCourseId(Long courseId){
        Optional<Course> course =  courseRepository.findById(courseId);
        Optional<List<CourseSkills>> courseSkillsList = courseSkillAssociationRepository.findByCourse(course);
        CourseSkillDTO courseSkillDTO = null;

        if(course.isPresent() && courseSkillsList.isPresent()){
            List<SkillDTO> skillDTOList = new ArrayList<>();
            SkillLevel profiency = null;

            for (CourseSkills courseSkills: courseSkillsList.get()){
                Skill currentSkill = courseSkills.getSkill();
                SkillDTO skillDTO = new SkillDTO(currentSkill);
                skillDTOList.add(skillDTO);
                profiency = courseSkills.getProfiency();
            }

            CourseDTO courseDTO = new CourseDTO(course.get());
            courseSkillDTO = CourseSkillDTO
                            .builder()
                            .skillDTOList(skillDTOList)
                            .courseDTO(courseDTO)
                            .profiency(profiency)
                            .build();
        }
        else{
            throw new ResourceNotFoundException("course id with " + courseId + " is not found in database");
        }
        return Optional.ofNullable(courseSkillDTO);
    }
}
