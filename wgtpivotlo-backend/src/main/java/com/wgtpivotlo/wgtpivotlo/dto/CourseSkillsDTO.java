package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CourseSkillsDTO {
    private Long courseId;
    private Long skillId;
    private SkillLevel profiency;
}
