package com.wgtpivotlo.wgtpivotlo.repository.criterias;

import com.wgtpivotlo.wgtpivotlo.dto.SkillIdWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.utils.FiltersHelper;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.apache.coyote.BadRequestException;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CareerSpecification {
    public static Specification<Career> getSpecification(String title,
                                                         String sector,
                                                         String careerLevel,
                                                         String skillFilters) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            // Process skill filters if present
            if (skillFilters != null && !skillFilters.trim().isEmpty()) {
                List<SkillIdWithProfiencyDTO> skillFilterList;
                try {
                    skillFilterList = FiltersHelper.extractSkillIdWithProfiencyDTO(skillFilters);
                } catch (BadRequestException e) {
                    throw new RuntimeException(e);
                }

                // For each filter, add a separate exists clause
                for (SkillIdWithProfiencyDTO filter : skillFilterList) {
                    Subquery<CareerSkills> subQuery = query.subquery(CareerSkills.class);
                    Root<CareerSkills> csRoot = subQuery.from(CareerSkills.class);

                    List<Predicate> subQueryPredicateList = new ArrayList<>();

                    // Correlate subquery with main query using the career id
                    Predicate careerJoin = criteriaBuilder.equal(
                            csRoot.get("career").get("id"), root.get("id")
                    );

                    // skillId = input skillId
                    Predicate skillMatch = criteriaBuilder.equal(
                            csRoot.get("skill").get("skillId"), filter.getSkillId()
                    );

                    // user may be searching without profiency
                    if(filter.getProfiency() != null){
                        Predicate proficiencyMatch = criteriaBuilder.equal(
                                csRoot.get("profiency"), filter.getProfiency()
                        );
                        subQueryPredicateList.add(proficiencyMatch);
                    }

                    // chain predicates to put in where
                    subQueryPredicateList.add(careerJoin);
                    subQueryPredicateList.add(skillMatch);

                    subQuery.select(csRoot)
                            .where(criteriaBuilder.and(subQueryPredicateList.toArray(new Predicate[0])));

                    // Add an exists predicate for this filter
                    predicates.add(criteriaBuilder.exists(subQuery));
                }
            }

            // Other filters
            if(title!=null){
                predicates.add(criteriaBuilder.like(root.get("title"), "%" + title + "%"));
            }
            // Other filters
            if(sector!=null){
                predicates.add(criteriaBuilder.equal(root.get("sector"), sector));
            }
            if(careerLevel != null){
                predicates.add(criteriaBuilder.equal(root.get("careerLevel"), careerLevel));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }



}
