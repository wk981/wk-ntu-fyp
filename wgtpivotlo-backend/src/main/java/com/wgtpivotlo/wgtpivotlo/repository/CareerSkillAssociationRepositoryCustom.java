package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import java.util.List;

interface CareerSkillAssociationRepositoryCustom {
    List<CareerSkills> findAllBySkillIdsAndProfiency(List<CareerSkillDTO> skillsProfiencyList);
}
