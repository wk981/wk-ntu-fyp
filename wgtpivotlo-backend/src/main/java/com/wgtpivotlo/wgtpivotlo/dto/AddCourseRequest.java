package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CourseSource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class AddCourseRequest {
    @NotNull(message = "Title cannot be null")
    @NotBlank(message="Title cannot be blank")
    private String name;

    private String link;
    private float rating;
    private float reviews_counts;
    private CourseSource courseSource;
}
