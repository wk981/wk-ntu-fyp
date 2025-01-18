package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CourseDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CourseWithSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.mapper.MappingUtils;
import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.model.CourseSkills;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.repository.CourseRepository;
import com.wgtpivotlo.wgtpivotlo.repository.CourseSkillAssociationRepository;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
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

    public CourseWithSkillsDTO findByCourseId(Long courseId){
        Optional<Course> course =  courseRepository.findById(courseId);
        Optional<List<CourseSkills>> courseSkillsList = courseSkillAssociationRepository.findByCourse(course);
        CourseWithSkillsDTO courseWithSkillsDTO = null;

        if(course.isPresent() && courseSkillsList.isPresent()){
            courseWithSkillsDTO = mappingUtils.mapSkillsIntoCourse(course.get(), courseSkillsList.get());
        }
        else{
            throw new ResourceNotFoundException("course id with " + courseId + " is not found in database");
        }
        return courseWithSkillsDTO;
    }

    // TODO: Implement
    public PageDTO<CourseDTO> findPaginatedCourseBySkillId(long skillId, int pageNumber, int pageSize) {
        int correctedPageNumber = (pageNumber > 0) ? pageNumber - 1 : 0;
        Pageable skillPageWithElements = PageRequest.of(correctedPageNumber, pageSize, Sort.by("rating").descending());

        log.info("Step1a: Making a query to get course based on skillId");
        Page<Course> paginatedCourses = courseRepository.findByCourseBySkillIdPaginated(skillId, skillPageWithElements);

        if (correctedPageNumber >= paginatedCourses.getTotalPages()) {
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        log.info("Step1b: Creating courseDTO");
        List<CourseDTO> courseDTOList = paginatedCourses.getContent().stream().map(CourseDTO::new).collect(Collectors.toList());;

        log.info("Step2: Tidying up body and pagination");
        return new PageDTO<>(paginatedCourses.getTotalPages(), pageNumber, courseDTOList);
    }
}
