package com.wgtpivotlo.wgtpivotlo.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class SkillWIthCareerLevelFlowDTO {
    SkillDTO skillDTO;
    List<String> skillFlow;
    Boolean inSkillset;
}
