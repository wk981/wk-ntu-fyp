package com.wgtpivotlo.wgtpivotlo.repository.criteria;

import com.wgtpivotlo.wgtpivotlo.dto.SkillIdWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.utils.CriteriaHelper;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Repository
public class CourseSkillAssociationRepositoryImpl implements RecommendationCriteria {
    private final EntityManager em;
    private final CriteriaHelper criteriaHelper;

    @Autowired
    public CourseSkillAssociationRepositoryImpl(EntityManager em, CriteriaHelper criteriaHelper) {
        this.em = em;
        this.criteriaHelper = criteriaHelper;
    }

    @Override
    public Optional<HashMap<String, List<Object[]>>> recommend(List<SkillIdWithProfiencyDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable page, Optional<String> sector) {
        throw new UnsupportedOperationException("Use the recommend method with CareerLevel for CareerRecommendation.");
    }

    @Override
    public Optional<Page<Object[]>> recommend(List<SkillIdWithProfiencyDTO> skillsProficiencyList, Pageable page) {
        return Optional.empty();
    }

    @Override
    public Optional<Page<Object[]>> findDirectMatches(List<SkillIdWithProfiencyDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector) {
        return Optional.empty();
    }

    @Override
    public Optional<Page<Object[]>> findPathways(List<SkillIdWithProfiencyDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector) {
        return Optional.empty();
    }

    @Override
    public Optional<Page<Object[]>> findAspirational(List<SkillIdWithProfiencyDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector) {
        return Optional.empty();
    }
}
