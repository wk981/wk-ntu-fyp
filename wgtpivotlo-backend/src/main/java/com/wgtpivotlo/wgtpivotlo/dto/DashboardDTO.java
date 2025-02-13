package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class DashboardDTO {
    String username;
    String pic;
    double careerProgression;
    List<SkillWithProfiencyDTO> userSkills;
    Career career;
    List<SkillWIthCareerLevelFlowDTO> skillGap;
}
