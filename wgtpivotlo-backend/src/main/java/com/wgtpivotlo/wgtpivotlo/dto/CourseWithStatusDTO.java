package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CourseWithStatusDTO {
    private CourseDTO courseDTO;
    private CourseStatus courseStatus;
}
