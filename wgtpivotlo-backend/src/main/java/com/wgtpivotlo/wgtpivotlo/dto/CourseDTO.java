package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CourseSource;
import com.wgtpivotlo.wgtpivotlo.model.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
    private long course_id;
    private String name;
    private String link;
    private float rating;
    private float reviews_counts;
    private CourseSource courseSource;

    public CourseDTO(Course course) {
        this.course_id = course.getCourse_id();
        this.name = course.getName();
        this.link = course.getLink();
        this.rating = course.getRating();
        this.reviews_counts = course.getReviews_counts();
        this.courseSource = course.getCourseSource();
    }
}
