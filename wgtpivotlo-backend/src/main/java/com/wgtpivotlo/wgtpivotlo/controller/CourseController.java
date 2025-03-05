package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.service.CourseService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/course")
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<PageDTO<CourseDTO>> getAllCourses(
            @RequestParam(defaultValue = "1") @Min(1) int pageNumber,
            @RequestParam(defaultValue = "10") @Min(1) int pageSize,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) float rating,
            @RequestParam(required = false) float reviewsCounts,
            @RequestParam(required = false) String courseSource,
            @RequestParam(required = false) String ratingOperator,
            @RequestParam(required = false) String reviewCountsOperator
    ){
        return ResponseEntity.ok(
                courseService.findAll(
                        pageNumber,
                        pageSize,
                        Optional.ofNullable(name),
                        Optional.of(rating),
                        Optional.of(reviewsCounts),
                        Optional.ofNullable(courseSource),
                        Optional.ofNullable(ratingOperator),
                        Optional.ofNullable(reviewCountsOperator)
                )
        );
    }

    @PostMapping("/")
    public ResponseEntity<MessageDTO> addCourse(@RequestPart("courseBody") @Valid AddCourseRequest request, @RequestPart("thumbnail") MultipartFile thumbnail) throws BadRequestException {
        courseService.addCourse(request,thumbnail);
        MessageDTO msg = MessageDTO.builder().message("Success").build();
        return ResponseEntity.status(HttpStatus.CREATED).body(msg);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageDTO> updateCourse(@RequestPart("courseBody") @Valid UpdateCourseRequest request, @RequestPart("thumbnail") MultipartFile thumbnail, @PathVariable long id) throws BadRequestException {
        courseService.updateCourse(request,thumbnail, id);
        MessageDTO msg = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(msg);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageDTO> deleteCourse(@PathVariable long id){
        courseService.deleteCourse(id);
        MessageDTO msg = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(msg);
    }

}
