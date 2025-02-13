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
public class CourseWithProfiencyDTO{
    private long course_id;
    private String name;
    private String link;
    private Double rating;
    private Double reviews_counts;
    private String courseSource;
    private String profiency;

    public CourseWithProfiencyDTO(Course course, String profiency){
        this.course_id = course.getCourse_id();
        this.name = course.getName();
        this.link = course.getLink();
        this.rating = (double) course.getRating();
        this.reviews_counts = (double) course.getReviews_counts();
        this.courseSource = String.valueOf(course.getCourseSource());
        this.profiency = profiency;

    }
}
