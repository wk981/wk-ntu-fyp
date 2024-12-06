package com.wgtpivotlo.wgtpivotlo.repository.criteria;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import org.hibernate.Session;
import org.hibernate.query.criteria.HibernateCriteriaBuilder;
import org.hibernate.query.criteria.JpaCriteriaQuery;
import org.hibernate.query.criteria.JpaSubQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class CareerSkillAssociationCriteriaImpl implements RecommendationCriteria {
    private EntityManager em;

    @Autowired
    public CareerSkillAssociationCriteriaImpl(EntityManager em) {
        this.em = em;
    }

    @Override
    public Page<Object[]> findAllBySkillIdsAndProfiency(List<CareerSkillDTO> skillsProfiencyList, Pageable pageable) {
        // Query builder. Using entitymanage unwrap and hibernate criteria builder for pagination count cus error: Already registered a copy: org.hibernate.query.sqm.tree.select.SqmSubQuery@25b07b73
        Session session = em.unwrap(Session.class);
        HibernateCriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();

        // Create query for main query.
        JpaCriteriaQuery<Object[]> criteriaQuery = criteriaBuilder.createQuery(Object[].class);
        // FROM Career Table
        Root<Career> CareerRoot = criteriaQuery.from(Career.class);

        // Create query that fetches long
        JpaSubQuery<Long> subQuery = criteriaQuery.subquery(Long.class);
        // FROM CareerSkills Table
        Root<CareerSkills> subRoot = subQuery.from(CareerSkills.class);

        // List to hold a chain of ORs Predicates. Predicate is WHERE conditions
        List<Predicate> orPredicates = new ArrayList<>();
        double totalWeightage = 0;

        // Iterate through the skillsProficiencyList
        for (CareerSkillDTO skillProficiency : skillsProfiencyList) {
            Optional<Long> skillId = skillProficiency.getSkillId().describeConstable();
            Optional<SkillLevel> profiency = Optional.ofNullable(skillProficiency.getProfiency());
            if (skillId.isPresent() && profiency.isPresent()) {
                // Map proficiency to levels, case(careerskill.profiency) as int
                Expression<Integer> skillProficiencyExpression = criteriaBuilder.selectCase()
                        .when(criteriaBuilder.equal(subRoot.get("profiency"), "Beginner"), 1)
                        .when(criteriaBuilder.equal(subRoot.get("profiency"), "Intermediate"), 2)
                        .otherwise(3)
                        .as(Integer.class);

                // Map input proficiency to level, case(user's skill profiency)
                Integer proficiencyLevel = switch (profiency.get().toString()) {
                    case "Beginner" -> 1;
                    case "Intermediate" -> 2;
                    case "Advanced" -> 3;
                    default -> throw new IllegalArgumentException("Invalid proficiency: " + profiency);
                };

                // Map input profiency into weighatage
                double proficiencyWeightage = switch (profiency.get().toString()) {
                    case "Beginner" -> 0.25;
                    case "Intermediate" -> 0.5;
                    case "Advanced" -> 1;
                    default -> throw new IllegalArgumentException("Invalid proficiency: " + profiency);
                };

                // Calculate weighted score
                totalWeightage += proficiencyWeightage;

                // Add the predicate for skillId and proficiency
                Predicate skillPredicate = criteriaBuilder.equal(subRoot.get("skill").get("skillId"), skillId.get());
                Predicate inclusiveCareerPredicate = criteriaBuilder.lessThanOrEqualTo(skillProficiencyExpression, proficiencyLevel); // Inclusive Career
                Predicate potentialCareerPredicate = criteriaBuilder.greaterThanOrEqualTo(skillProficiencyExpression, proficiencyLevel); // Potential Career
                // (case(careerskill.profiency) <= case(user's skill profiency) or case(careerskill.profiency) >= case(user's skill profiency))

                Predicate proficiencyPredicate = criteriaBuilder.or(inclusiveCareerPredicate, potentialCareerPredicate);

                // Combine predicates with AND and add to orPredicates
                orPredicates.add(criteriaBuilder.and(skillPredicate, proficiencyPredicate)); // skillId and (case()...)
            }
        }
        // Chain subquery's Ors
        Predicate finalPredicate = criteriaBuilder.or(orPredicates.toArray(new Predicate[0]));

        // Complete subquery
        subQuery
                .select(subRoot.get("career").get("careerId"))
                .where(finalPredicate);

        // Explicit join with CareerSkills based on foreign key
        // https://stackoverflow.com/questions/4483576/how-to-write-subqueries-with-in-expressions-in-jpa-2-0-criteria-api
        Root<CareerSkills> careerSkillsRoot = criteriaQuery.from(CareerSkills.class);
        Predicate joinCondition = criteriaBuilder.equal(CareerRoot.get("careerId"), careerSkillsRoot.get("career").get("careerId"));

        // Complete mainquery
        criteriaQuery
                .multiselect(
                        CareerRoot, // Select the entire Career entity
                        criteriaBuilder.quot(
                                totalWeightage, // Total weightage (numerator)
                                criteriaBuilder.count(careerSkillsRoot.get("skill").get("skillId")) // Count of skills (denominator)
                        ).alias("averageWeightage")
                )
                .where(criteriaBuilder
                        .and(
                                joinCondition,
                                criteriaBuilder
                                        .in(CareerRoot.get("careerId"))
                                        .value(subQuery)
                        ))
                .groupBy(CareerRoot.get("careerId"))
                .orderBy(criteriaBuilder.desc(                        criteriaBuilder.quot(
                        totalWeightage, // Total weightage (numerator)
                        criteriaBuilder.count(careerSkillsRoot.get("skill").get("skillId")) // Count of skills (denominator)
                )));

        // first result is offset where the record first index at. Max results is the index 0 to n
        List<Object[]> careerWithSimilarityRes = em.createQuery(criteriaQuery).setFirstResult((int) pageable.getOffset()).setMaxResults(pageable.getPageSize()).getResultList();

        // In Hibernate 6 it's no longer possible to reuse Predicates across different CriteriaQueries.
        // Have to make a method that receives your original query and returns the total count.
        // https://stackoverflow.com/questions/76724115/already-registered-a-copy-org-hibernate-query-sqm-tree-select-sqmsubquery-gett/79121937#79121937
        Long count = session.createQuery(criteriaQuery.createCountQuery()).getSingleResult();

        return new PageImpl<>(careerWithSimilarityRes, pageable, count);
    }
}
