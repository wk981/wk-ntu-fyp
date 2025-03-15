package com.wgtpivotlo.wgtpivotlo.repository.criterias;

import com.wgtpivotlo.wgtpivotlo.dto.SkillIdWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.model.CourseSkills;
import com.wgtpivotlo.wgtpivotlo.utils.FiltersHelper;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.apache.coyote.BadRequestException;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CourseSpecification {
    public static Specification<Course> getSpecification(
            Optional<String> name,
            Optional<Float> rating,
            Optional<Float> reviewsCounts,
            Optional<String> courseSource,
            Optional<String> ratingOperator,
            Optional<String> reviewCountsOperator,
            Optional<String> skillFilters
    ) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            if(skillFilters.isPresent() && !skillFilters.get().trim().isEmpty()){
                List<SkillIdWithProfiencyDTO> skillFilterList;
                try {
                    skillFilterList = FiltersHelper.extractSkillIdWithProfiencyDTO(skillFilters.get());
                } catch (BadRequestException e) {
                    throw new RuntimeException(e);
                }
                // For each filter, add a separate exists clause
                for (SkillIdWithProfiencyDTO filter : skillFilterList) {
                    Subquery<CourseSkills> subQuery = query.subquery(CourseSkills.class);
                    Root<CourseSkills> csRoot = subQuery.from(CourseSkills.class);

                    List<Predicate> subQueryPredicateList = new ArrayList<>();

                    // Correlate subquery with main query using the career id
                    Predicate courseJoin = criteriaBuilder.equal(
                            csRoot.get("course").get("course_id"), root.get("id")
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
                    subQueryPredicateList.add(courseJoin);
                    subQueryPredicateList.add(skillMatch);

                    subQuery.select(csRoot)
                            .where(criteriaBuilder.and(subQueryPredicateList.toArray(new Predicate[0])));

                    // Add an exists predicate for this filter
                    predicates.add(criteriaBuilder.exists(subQuery));
                }

            }

            name.ifPresent(t -> predicates.add(criteriaBuilder.like(root.get("name"), "%" + t + "%")));
            rating.ifPresent(r -> {
                if (ratingOperator.isPresent() && ratingOperator.get().equals("ge")) {
                    predicates.add(criteriaBuilder.ge(root.get("rating"), r));
                } else if (ratingOperator.isPresent() && ratingOperator.get().equals("le")) {
                    predicates.add(criteriaBuilder.le(root.get("rating"), r));
                } else if (ratingOperator.isPresent() && ratingOperator.get().equals("gt")) {
                    predicates.add(criteriaBuilder.gt(root.get("rating"), r));
                } else if (ratingOperator.isPresent() && ratingOperator.get().equals("lt")) {
                    predicates.add(criteriaBuilder.lt(root.get("rating"), r));
                } else {
                    predicates.add(criteriaBuilder.equal(root.get("rating"), r));
                }
            });
            reviewsCounts.ifPresent(
                    rc -> {
                        if(reviewCountsOperator.isPresent() && reviewCountsOperator.get().equals("ge")){
                            predicates.add(criteriaBuilder.ge(root.get("reviews_counts"), rc));
                        }
                        else if(reviewCountsOperator.isPresent() && reviewCountsOperator.get().equals("le")){
                            predicates.add(criteriaBuilder.le(root.get("reviews_counts"), rc));
                        }
                        else if(reviewCountsOperator.isPresent() && reviewCountsOperator.get().equals("gt")){
                            predicates.add(criteriaBuilder.gt(root.get("reviews_counts"), rc));
                        }
                        else if(reviewCountsOperator.isPresent() && reviewCountsOperator.get().equals("lt")){
                            predicates.add(criteriaBuilder.lt(root.get("reviews_counts"), rc));
                        }
                        else{
                            predicates.add(criteriaBuilder.equal(root.get("reviews_counts"), rc));
                        }
            });
            courseSource.ifPresent(cs -> predicates.add(criteriaBuilder.equal(root.get("courseSource"), cs)));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
