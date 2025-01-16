package com.wgtpivotlo.wgtpivotlo.repository.criteria;

import com.wgtpivotlo.wgtpivotlo.dto.SkillIdWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.Choice;
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

import java.util.*;

@Repository
public class CareerSkillAssociationRepositoryImpl implements RecommendationCriteria {
    private EntityManager em;

    @Autowired
    public CareerSkillAssociationRepositoryImpl(EntityManager em) {
        this.em = em;
    }

    @Override
    public Optional<HashMap<String, List<Object[]>>> recommend(List<SkillIdWithProfiencyDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector) {
        Optional<Page<Object[]>> findDirectMatchesPage = findDirectMatches(skillsProfiencyList, careerLevel,pageable,sector);
        Optional<Page<Object[]>> findPathwaysPage = findPathways(skillsProfiencyList, careerLevel,pageable,sector);
        Optional<Page<Object[]>> findAspirational = findAspirational(skillsProfiencyList, careerLevel,pageable,sector);
        HashMap<String, List<Object[]>> res = new HashMap<>();
        Set<Object[]> visited = new HashSet<>();

        findDirectMatchesPage.ifPresent(objects -> helperRecommend(objects.getContent(), visited, "directMaches", res));
        findPathwaysPage.ifPresent(objects -> helperRecommend(objects.getContent(), visited,"pathwayMatches", res));
        findAspirational.ifPresent(objects -> helperRecommend(objects.getContent(),visited, "aspirationMatches", res));
        return Optional.of(res);
    }

    private void helperRecommend(List<Object[]> list, Set<Object[]> visited, String key, HashMap<String, List<Object[]>> res){
        List<Object[]> temp = new ArrayList<>();
        for (Object[] object: list){
            if(!visited.contains(object)){
                temp.add(object);
                visited.add(object);
            }
        }
        res.put(key, temp);
    }

    @Override
    public Optional<HashMap<String, Page<Object[]>>> recommend(List<SkillIdWithProfiencyDTO> skillsProficiencyList, Pageable page) {
        throw new UnsupportedOperationException("Use the recommend method with CareerLevel for CareerRecommendation.");
    }

    @Override
    public Optional<Page<Object[]>> findDirectMatches(List<SkillIdWithProfiencyDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector){
        return findByCareerLevel(skillsProfiencyList, careerLevel, pageable, sector, Choice.DIRECT_MATCH);
    }

    @Override
    public Optional<Page<Object[]>> findPathways(List<SkillIdWithProfiencyDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector){

        return findByCareerLevel(skillsProfiencyList, careerLevel, pageable, sector, Choice.PATHWAY);
    }

    @Override
    public Optional<Page<Object[]>> findAspirational(List<SkillIdWithProfiencyDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector){
        return findByCareerLevel(skillsProfiencyList, careerLevel, pageable, sector, Choice.ASPIRATION);
    }

    // findByCareerLevel is a dynamic query. Predicate careerLevelPredicate where predicate is the condition built on a higher level.
    // NOTE: May need to refactor, look so ugly
    private Optional<Page<Object[]>> findByCareerLevel(List<SkillIdWithProfiencyDTO> skillsProfiencyList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector, Choice choice) {
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
        for (SkillIdWithProfiencyDTO skillProficiency : skillsProfiencyList) {
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
                Integer proficiencyLevel = profiency.get().toInt();

                // Map input profiency into weighatage
                double proficiencyWeightage = profiency.get().toWeightedDouble();

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

        // Calculate Total weightage.
        // total weightage = skill matching weightage * (weighted profiency * skill)/(total skills) + career level matching weightage * ( 1 - abs(career's career level - user) ) / 1
        // The total weightage has to best casted into expression so it can run in the select statement
        double skillMatchingWeight = 0.75;
        double levelMatchingWeight = 1 - skillMatchingWeight;

        double userCareerLevelValue = careerLevel.toWeightedDouble();

        // Calculate Career Level Factor
        double careerLevelFactor = userCareerLevelValue * levelMatchingWeight;

        Expression<Double> weightedAverage = criteriaBuilder.quot(
                totalWeightage, // Total weightage (numerator)
                criteriaBuilder.count(careerSkillsRoot.get("skill").get("skillId")) // Count of skills (denominator)
        ).asDouble();

        // Calculate Skill Proficiency Factor
        Expression<Double> skillProficiencyFactor = criteriaBuilder.prod(skillMatchingWeight, weightedAverage);

        // Combine Factors
        Expression<Double> similarityScore = criteriaBuilder.sum(skillProficiencyFactor, careerLevelFactor);

        Expression<Integer> careerLevelExpress = criteriaBuilder.selectCase()
                .when(criteriaBuilder.equal(CareerRoot.get("careerLevel"), "Entry Level"), 1)
                .when(criteriaBuilder.equal(CareerRoot.get("careerLevel"), "Mid Level"), 2)
                .otherwise(3)
                .as(Integer.class);

        Predicate careerLevelPredicate = switch (choice){
            case ASPIRATION -> criteriaBuilder.greaterThanOrEqualTo(careerLevelExpress, careerLevel.toInt());
            case DIRECT_MATCH -> criteriaBuilder.equal(careerLevelExpress, careerLevel.toInt());
            case PATHWAY -> criteriaBuilder.lessThanOrEqualTo(careerLevelExpress, careerLevel.toInt());
        };

        // Complete mainquery
        criteriaQuery
                .multiselect(
                        CareerRoot, // Select the entire Career entity
                        similarityScore.alias("averageWeightage")
                )
                .where(criteriaBuilder
                        .and(
                                joinCondition,
                                criteriaBuilder
                                        .in(CareerRoot.get("careerId"))
                                        .value(subQuery),
                                careerLevelPredicate
                        ))
                .groupBy(CareerRoot.get("careerId"))
                .orderBy(criteriaBuilder.desc(similarityScore));

        // first result is offset where the record first index at. Max results is the index 0 to n
        List<Object[]> careerWithSimilarityRes = em.createQuery(criteriaQuery).setFirstResult((int) pageable.getOffset()).setMaxResults(pageable.getPageSize()).getResultList();

        // In Hibernate 6 it's no longer possible to reuse Predicates across different CriteriaQueries.
        // Have to make a method that receives your original query and returns the total count.
        // https://stackoverflow.com/questions/76724115/already-registered-a-copy-org-hibernate-query-sqm-tree-select-sqmsubquery-gett/79121937#79121937
        Long count = session.createQuery(criteriaQuery.createCountQuery()).getSingleResult();

        if (careerWithSimilarityRes.isEmpty()){
            return Optional.empty();
        }
        return Optional.of(new PageImpl<>(careerWithSimilarityRes, pageable, count));
    }
}
