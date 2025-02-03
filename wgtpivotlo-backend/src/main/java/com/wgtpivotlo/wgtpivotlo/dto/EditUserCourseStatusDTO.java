package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditUserCourseStatusDTO {
    private CourseStatus courseStatus;
    private long courseId;
}
