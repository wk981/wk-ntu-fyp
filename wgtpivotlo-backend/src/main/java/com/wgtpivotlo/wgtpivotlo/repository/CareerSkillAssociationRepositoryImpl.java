package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
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
    public List<CareerSkills> findAllBySkillIdsAndProfiency(List<CareerSkillDTO> skillsProfiencyList) {
        CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();
        CriteriaQuery<CareerSkills> criteriaQuery = criteriaBuilder.createQuery(CareerSkills.class);
        Root<CareerSkills> root = criteriaQuery.from(CareerSkills.class);
        // List to hold predicates
        List<Predicate> orPredicates = new ArrayList<>();
        // Iterate through the skillsProficiencyList
        for (CareerSkillDTO skillProficiency : skillsProfiencyList) {
            Optional<Long> skillId = skillProficiency.getSkillId().describeConstable();
            Optional<SkillLevel> profiency = Optional.ofNullable(skillProficiency.getProfiency());
            if (skillId.isPresent() && profiency.isPresent()) {

                // Map proficiency to levels (if needed)
                Expression<Integer> skillProficiencyExpression = criteriaBuilder.selectCase()
                        .when(criteriaBuilder.equal(root.get("profiency"), "Beginner"), 1)
                        .when(criteriaBuilder.equal(root.get("profiency"), "Intermediate"), 2)
                        .otherwise(3)
                        .as(Integer.class);

                // Map input proficiency to level
                Integer proficiencyLevel = switch (profiency.get().toString()) {
                    case "Beginner" -> 1;
                    case "Intermediate" -> 2;
                    case "Advanced" -> 3;
                    default -> throw new IllegalArgumentException("Invalid proficiency: " + profiency);
                };

                // Add the predicate for skillId and proficiency
                Predicate skillPredicate = criteriaBuilder.equal(root.get("skill").get("skillId"), skillId.get());
                Predicate proficiencyPredicate = criteriaBuilder.lessThanOrEqualTo(skillProficiencyExpression, proficiencyLevel);

                // Combine predicates with AND and add to orPredicates
                orPredicates.add(criteriaBuilder.and(skillPredicate, proficiencyPredicate));
            }
        }
        // Combine all the OR predicates
        if (!orPredicates.isEmpty()) {
            Predicate finalPredicate = criteriaBuilder.or(orPredicates.toArray(new Predicate[0]));
            criteriaQuery.where(finalPredicate);
        }

        // Execute the query
        return em.createQuery(criteriaQuery).getResultList();
    }
}
