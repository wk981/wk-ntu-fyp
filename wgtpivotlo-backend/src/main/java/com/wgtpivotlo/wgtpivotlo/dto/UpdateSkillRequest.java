package com.wgtpivotlo.wgtpivotlo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class UpdateSkillRequest {
    private String name;
    private String description;
}
