package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.AddCourseRequest;
import com.wgtpivotlo.wgtpivotlo.dto.CourseDTO;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.UpdateCourseRequest;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.repository.CourseRepository;
import com.wgtpivotlo.wgtpivotlo.repository.criterias.CourseSpecification;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public PageDTO<CourseDTO> findAll(
            int pageNumber,
            int pageSize,
            Optional<String> name,
            Optional<Float> rating,
            Optional<Float> reviewsCounts,
            Optional<String> courseSource,
            Optional<String> ratingOperator,
            Optional<String> reviewCountsOperator
            ) {
        int correctedPageNumber = (pageNumber > 0) ? pageNumber - 1 : 0;
        Pageable pageable = PageRequest.of(correctedPageNumber, pageSize);
        Specification<Course> specification = CourseSpecification.getSpecification(name, rating, reviewsCounts, courseSource, ratingOperator, reviewCountsOperator);
        Page<Course> courses = courseRepository.findAll(specification,pageable);

        if (correctedPageNumber >= courses.getTotalPages()) {
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        List<CourseDTO> courseDTOList = courses.getContent().stream().map(CourseDTO::new).toList();
        return new PageDTO<>(courses.getTotalPages(), pageNumber, courseDTOList);

    }

    @Transactional
    public void addCourse(AddCourseRequest request, MultipartFile thumbnail) throws BadRequestException {
        if (request == null){
            throw new BadRequestException("Bad Request");
        }
        Course course = new Course();
        Optional.ofNullable(request.getName()).ifPresent(course::setName);
        Optional.ofNullable(request.getLink()).ifPresent(course::setLink);
        Optional.ofNullable(request.getRating()).ifPresent(course::setRating);
        Optional.ofNullable(request.getCourseSource()).ifPresent(course::setCourseSource);
        Optional.ofNullable(request.getReviews_counts()).ifPresent(course::setReviews_counts);

        course.setUpdated_on(LocalDateTime.now());
        course.setCreated_on(LocalDateTime.now());
        log.info("Course added");
        courseRepository.save(course);
    }

    @Transactional
    public void updateCourse(UpdateCourseRequest request, MultipartFile thumbnail, long id) throws BadRequestException {
        if (request == null){
            throw new BadRequestException("Bad Request");
        }
        Course course = getCourse(id);
        Optional.ofNullable(request.getName()).ifPresent(course::setName);
        Optional.ofNullable(request.getLink()).ifPresent(course::setLink);
        Optional.ofNullable(request.getRating()).ifPresent(course::setRating);
        Optional.ofNullable(request.getCourseSource()).ifPresent(course::setCourseSource);
        Optional.ofNullable(request.getReviews_counts()).ifPresent(course::setReviews_counts);

        course.setUpdated_on(LocalDateTime.now());
        log.info("Course updated");
        courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(long id) {
        Course course = getCourse(id);
        log.info("Course deleted");
        courseRepository.delete(course);
    }

    private Course getCourse(long id){
        Optional<Course> course = courseRepository.findById(id);
        course.orElseThrow(() -> new ResourceNotFoundException("Course does not exist"));
        return course.get();
    }

}
