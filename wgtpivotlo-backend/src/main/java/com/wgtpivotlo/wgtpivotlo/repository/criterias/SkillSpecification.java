package com.wgtpivotlo.wgtpivotlo.repository.criterias;

import com.wgtpivotlo.wgtpivotlo.model.Skill;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class SkillSpecification {
    public static Specification<Skill> getSpecification(Optional<String> name) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            name.ifPresent(n -> predicates.add(criteriaBuilder.like(root.get("name"), "%" + n + "%")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
