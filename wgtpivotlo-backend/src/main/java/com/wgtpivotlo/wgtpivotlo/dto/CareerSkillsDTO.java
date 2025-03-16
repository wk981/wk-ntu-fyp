package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CareerSkillsDTO {
    private Long skillId;
    private Long careerId;
    private SkillLevel profiency;
}
