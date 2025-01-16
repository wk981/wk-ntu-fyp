package com.wgtpivotlo.wgtpivotlo.utils;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Component;

@Component
public class CriteriaHelper {
    public <T> Expression<Integer> mapProfiencyToPriority(
            CriteriaBuilder criteriaBuilder, Root<T> root, String fieldName) {
        return criteriaBuilder.selectCase()
                .when(criteriaBuilder.equal(root.get(fieldName), "Beginner"), 1)
                .when(criteriaBuilder.equal(root.get(fieldName), "Intermediate"), 2)
                .otherwise(3)
                .as(Integer.class);
    }
}
