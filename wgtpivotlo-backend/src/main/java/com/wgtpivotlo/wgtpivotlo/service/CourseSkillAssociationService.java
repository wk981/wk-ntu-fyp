package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.DuplicateException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.mapper.MappingUtils;
import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.model.CourseSkills;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.repository.CourseRepository;
import com.wgtpivotlo.wgtpivotlo.repository.CourseSkillAssociationRepository;
import com.wgtpivotlo.wgtpivotlo.repository.SkillRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
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
    private final SkillRepository skillRepository;

    @Autowired
    public CourseSkillAssociationService(CourseRepository courseRepository, CourseSkillAssociationRepository courseSkillAssociationRepository, MappingUtils mappingUtils, SkillRepository skillRepository) {
        this.courseRepository = courseRepository;
        this.courseSkillAssociationRepository = courseSkillAssociationRepository;
        this.mappingUtils = mappingUtils;
        this.skillRepository = skillRepository;
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

    @Transactional
    public void addCourseSkill(CourseSkillsDTO courseSkillsDTO) throws BadRequestException {
        if(courseSkillsDTO == null){
            throw new BadRequestException("Bad request");
        }
        Optional<CourseSkills> existingCourseSkills = courseSkillAssociationRepository.findByCourseIdAndSkillId(courseSkillsDTO.getCourseId(), courseSkillsDTO.getSkillId());
        if(existingCourseSkills.isPresent()){
            throw new DuplicateException("Skill is already associated with Course");
        }

        CourseSkills newCourseSkills = new CourseSkills();
        Course course = courseRepository.findById(courseSkillsDTO.getCourseId()).orElseThrow(()-> new ResourceNotFoundException("Course not found"));
        Skill skill = skillRepository.findById(courseSkillsDTO.getSkillId()).orElseThrow(()-> new ResourceNotFoundException("Course not found"));

        newCourseSkills.setSkill(skill);
        newCourseSkills.setCourse(course);
        newCourseSkills.setProfiency(courseSkillsDTO.getProfiency());

        courseSkillAssociationRepository.save(newCourseSkills);
    }

    @Transactional
    public void editCourseSkill(CourseSkillsDTO courseSkillsDTO) throws BadRequestException {
        if (courseSkillsDTO == null) {
            throw new BadRequestException("Invalid request: CourseSkillsDTO cannot be null");
        }

        // Fetch the existing Course-Skill association
        CourseSkills existingCourseSkills = courseSkillAssociationRepository
                .findByCourseIdAndSkillId(courseSkillsDTO.getCourseId(), courseSkillsDTO.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Course-Skill not found"));

        // Ensure the course matches
        if (!courseSkillsDTO.getCourseId().equals(existingCourseSkills.getCourse().getCourse_id())) {
            throw new BadRequestException("Course does not match");
        }

        boolean isUpdated = false;

        // Only update proficiency if needed
        if (courseSkillsDTO.getProfiency() != null &&
                !courseSkillsDTO.getProfiency().equals(existingCourseSkills.getProfiency())) {

            existingCourseSkills.setProfiency(courseSkillsDTO.getProfiency());
            isUpdated = true;
        }

        // Save only if changes were made
        if (isUpdated) {
            courseSkillAssociationRepository.save(existingCourseSkills);
        }
    }


    @Transactional
    public void deleteCourseSkill(CourseSkillsDTO courseSkillsDTO) throws BadRequestException {
        if (courseSkillsDTO == null || courseSkillsDTO.getCourseId() == null || courseSkillsDTO.getSkillId() == null) {
            throw new BadRequestException("Invalid request: Course ID and Skill ID must be provided");
        }

        // Find and delete the association
        CourseSkills existingCourseSkill = courseSkillAssociationRepository
                .findByCourseIdAndSkillId(courseSkillsDTO.getCourseId(), courseSkillsDTO.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Course-Skill association not found"));

        courseSkillAssociationRepository.delete(existingCourseSkill);
        courseSkillAssociationRepository.flush(); // Ensure immediate execution
    }

}
