package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

interface CareerSkillAssociationRepositoryCustom {
    Page<Object> findAllBySkillIdsAndProfiency(List<CareerSkillDTO> skillsProfiencyList, Pageable page);
}
