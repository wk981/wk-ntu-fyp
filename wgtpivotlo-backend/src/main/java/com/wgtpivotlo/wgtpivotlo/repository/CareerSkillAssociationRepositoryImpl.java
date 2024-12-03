package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class CareerSkillAssociationRepositoryImpl implements CareerSkillAssociationRepositoryCustom{
    private EntityManager em;

    @Autowired
    public CareerSkillAssociationRepositoryImpl(EntityManager em) {
        this.em = em;
    }

    @Override
    public List<Object> findAllBySkillIdsAndProfiency(List<CareerSkillDTO> skillsProfiencyList) {
        CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();

        CriteriaQuery<Object> criteriaQuery = criteriaBuilder.createQuery(Object.class);
        Root<Career> CareerRoot = criteriaQuery.from(Career.class);

        // Explicit join with CareerSkills based on foreign key
        // https://stackoverflow.com/questions/4483576/how-to-write-subqueries-with-in-expressions-in-jpa-2-0-criteria-api
        Root<CareerSkills> careerSkillsRoot = criteriaQuery.from(CareerSkills.class);
        Predicate joinCondition = criteriaBuilder.equal(CareerRoot.get("careerId"), careerSkillsRoot.get("career").get("careerId"));

        Subquery<Long> subQuery = criteriaQuery.subquery(Long.class);
        Root<CareerSkills> subRoot = subQuery.from(CareerSkills.class);

        // List to hold predicates
        List<Predicate> orPredicates = new ArrayList<>();
        double totalWeightage = 0;
        // Iterate through the skillsProficiencyList
        for (CareerSkillDTO skillProficiency : skillsProfiencyList) {
            Optional<Long> skillId = skillProficiency.getSkillId().describeConstable();
            Optional<SkillLevel> profiency = Optional.ofNullable(skillProficiency.getProfiency());
            if (skillId.isPresent() && profiency.isPresent()) {
                // Map proficiency to levels
                Expression<Integer> skillProficiencyExpression = criteriaBuilder.selectCase()
                        .when(criteriaBuilder.equal(subRoot.get("profiency"), "Beginner"), 1)
                        .when(criteriaBuilder.equal(subRoot.get("profiency"), "Intermediate"), 2)
                        .otherwise(3)
                        .as(Integer.class);

                // Map input proficiency to level
                Integer proficiencyLevel = switch (profiency.get().toString()) {
                    case "Beginner" -> 1;
                    case "Intermediate" -> 2;
                    case "Advanced" -> 3;
                    default -> throw new IllegalArgumentException("Invalid proficiency: " + profiency);
                };

                double proficiencyWeightage = switch (profiency.get().toString()) {
                    case "Beginner" -> 0.25;
                    case "Intermediate" -> 0.5;
                    case "Advanced" -> 1;
                    default -> throw new IllegalArgumentException("Invalid proficiency: " + profiency);
                };
                totalWeightage += proficiencyWeightage;

                // Add the predicate for skillId and proficiency
                Predicate skillPredicate = criteriaBuilder.equal(subRoot.get("skill").get("skillId"), skillId.get());
                Predicate proficiencyPredicate = criteriaBuilder.lessThanOrEqualTo(skillProficiencyExpression, proficiencyLevel);

                // Combine predicates with AND and add to orPredicates
                orPredicates.add(criteriaBuilder.and(skillPredicate, proficiencyPredicate));

                // calculate weighted score
            }
        }

        Predicate finalPredicate = criteriaBuilder.or(orPredicates.toArray(new Predicate[0]));
        subQuery
                .select(subRoot.get("career").get("careerId"))
                .where(finalPredicate);

        criteriaQuery
                .multiselect(
                        CareerRoot, // Select the entire Career entity
                        criteriaBuilder.quot(
                                totalWeightage, // Total weightage (numerator)
                                criteriaBuilder.count(careerSkillsRoot.get("skill").get("skillId")) // Count of skills (denominator)
                        ).alias("averageWeightage")
                )
                .where(
                        criteriaBuilder
                                .and(
                                        joinCondition,
                                        criteriaBuilder
                                                .in(CareerRoot.get("careerId"))
                                                .value(subQuery)
                                )
                )
                .groupBy(CareerRoot.get("careerId"))
                .orderBy(criteriaBuilder.desc(                        criteriaBuilder.quot(
                        totalWeightage, // Total weightage (numerator)
                        criteriaBuilder.count(careerSkillsRoot.get("skill").get("skillId")) // Count of skills (denominator)
                )));

        List<Object> res = em.createQuery(criteriaQuery).getResultList();

        return res;
    }
}
