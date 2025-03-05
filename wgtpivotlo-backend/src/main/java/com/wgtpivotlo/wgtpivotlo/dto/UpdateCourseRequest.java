package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CourseSource;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class UpdateCourseRequest {
    private String name;

    private String link;
    private float rating;
    private float reviews_counts;
    private CourseSource courseSource;
}
