package com.wgtpivotlo.wgtpivotlo.repository.criterias;

import com.wgtpivotlo.wgtpivotlo.model.Course;
import jakarta.persistence.criteria.Predicate;
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
            Optional<String> reviewCountsOperator
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
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
