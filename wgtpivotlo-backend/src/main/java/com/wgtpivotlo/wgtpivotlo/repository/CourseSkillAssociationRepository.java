package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.model.CourseSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseSkillAssociationRepository extends JpaRepository<CourseSkills, Long>{
    Optional<List<CourseSkills>> findByCourse(Optional<Course> course);

    @Query(value = "SELECT cs.* FROM course_skill cs WHERE cs.course_id = :courseId AND cs.skill_id = :skillId", nativeQuery = true)
    Optional<CourseSkills> findByCourseIdAndSkillId(@Param("courseId") Long courseId, @Param("skillId") Long skillId);

}
