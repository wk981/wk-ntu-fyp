package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CourseWithStatusDTO {
    private CourseWithProfiencyDTO courseWithProfiencyDTO;
    private CourseStatus courseStatus;
}
