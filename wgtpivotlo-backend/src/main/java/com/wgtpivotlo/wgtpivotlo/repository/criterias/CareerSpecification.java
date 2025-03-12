package com.wgtpivotlo.wgtpivotlo.repository.criterias;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CareerSpecification {
    public static Specification<Career> getSpecification(Optional<String> title, Optional<String> sector, Optional<String> careerLevel) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            title.ifPresent(t -> predicates.add(criteriaBuilder.like(root.get("title"), "%" + t + "%")));
            sector.ifPresent(s -> predicates.add(criteriaBuilder.equal(root.get("sector"), s)));
            careerLevel.ifPresent(cl -> predicates.add(criteriaBuilder.equal(root.get("careerLevel"), cl)));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

}
