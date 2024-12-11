package com.wgtpivotlo.wgtpivotlo.repository.criteria;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;
import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

public interface RecommendationCriteria{
    Optional<HashMap<String, List<Object[]>>> recommend(
            List<CareerSkillDTO> skillsProfiencyList,
            CareerLevel careerLevel,
            Pageable page,
            Optional<String> sector
    );

    Optional<HashMap<String, List<Object[]>>> recommend(
            List<CareerSkillDTO> skillsProficiencyList,
            Pageable page,
            Optional<String> sector
    );

    Optional<Page<Object[]>> findDirectMatches(List<CareerSkillDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector);

    Optional<Page<Object[]>> findPathways(List<CareerSkillDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector);

    Optional<Page<Object[]>> findAspirational(List<CareerSkillDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector);


}
