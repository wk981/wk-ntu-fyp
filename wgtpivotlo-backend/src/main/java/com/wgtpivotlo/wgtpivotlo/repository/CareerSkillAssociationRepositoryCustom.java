package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;

import java.util.List;

interface CareerSkillAssociationRepositoryCustom {
    List<Object> findAllBySkillIdsAndProfiency(List<CareerSkillDTO> skillsProfiencyList);
}
