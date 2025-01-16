package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.model.CourseSkills;
import com.wgtpivotlo.wgtpivotlo.repository.criteria.RecommendationCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseSkillAssociationRepository extends JpaRepository<CourseSkills, Long>, RecommendationCriteria {
    Optional<List<CourseSkills>> findByCourse(Optional<Course> course);
}
