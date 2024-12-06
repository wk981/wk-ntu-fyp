package com.wgtpivotlo.wgtpivotlo.repository.criteria;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RecommendationCriteria{
    Page<Object[]> findAllBySkillIdsAndProfiency(List<CareerSkillDTO> skillsProfiencyList, Pageable page);
}
