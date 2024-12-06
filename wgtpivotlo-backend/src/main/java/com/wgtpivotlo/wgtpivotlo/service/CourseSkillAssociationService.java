package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CourseDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CourseWithSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.mapper.MappingUtils;
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
    private final MappingUtils mappingUtils;

    @Autowired
    public CourseSkillAssociationService(CourseRepository courseRepository, CourseSkillAssociationRepository courseSkillAssociationRepository, MappingUtils mappingUtils) {
        this.courseRepository = courseRepository;
        this.courseSkillAssociationRepository = courseSkillAssociationRepository;
        this.mappingUtils = mappingUtils;
    }

    public Optional<CourseWithSkillsDTO> findByCourseId(Long courseId){
        Optional<Course> course =  courseRepository.findById(courseId);
        Optional<List<CourseSkills>> courseSkillsList = courseSkillAssociationRepository.findByCourse(course);
        CourseWithSkillsDTO courseWithSkillsDTO = null;

        if(course.isPresent() && courseSkillsList.isPresent()){
            courseWithSkillsDTO = mappingUtils.mapSkillsIntoCourse(course.get(), courseSkillsList.get());
        }
        else{
            throw new ResourceNotFoundException("course id with " + courseId + " is not found in database");
        }
        return Optional.ofNullable(courseWithSkillsDTO);
    }
}
