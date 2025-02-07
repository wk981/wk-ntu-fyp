package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.dto.CourseWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CourseWithSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.model.Course;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    @Query(value = "SELECT c.* FROM course c INNER JOIN course_skill cs ON c.course_id = cs.course_id WHERE cs.skill_id = :skillId",
            countQuery = "SELECT count(c.*) FROM course c INNER JOIN course_skill cs ON c.course_id = cs.course_id WHERE cs.skill_id = :skillId",
            nativeQuery = true)
    Page<Course> findByCourseBySkillIdPaginated(long skillId, Pageable pageable);

    @Query(value = "SELECT c.*, cs.profiency FROM course c " +
            "INNER JOIN course_skill cs ON c.course_id = cs.course_id " +
            "WHERE cs.skill_id = :skillId " +
            "AND (cs.profiency IN :recommendedSkillLevels) " + // Filter by levels
            "AND (:filterBySkillLevel is null or cs.profiency = :filterBySkillLevel)" +
            "ORDER BY CASE " +
            "  WHEN cs.profiency = 'Beginner' THEN 1 " +
            "  WHEN cs.profiency = 'Intermediate' THEN 2 " +
            "  WHEN cs.profiency = 'Advanced' THEN 3 " +
            "  ELSE 4 END" ,
            countQuery = "SELECT count(*) FROM course c " +
                    "INNER JOIN course_skill cs ON c.course_id = cs.course_id " +
                    "WHERE cs.skill_id = :skillId " +
                    "AND (cs.profiency IN :recommendedSkillLevels)" +
                    "AND (:filterBySkillLevel is null or cs.profiency = :filterBySkillLevel)",
            nativeQuery = true)
    Page<Object[]> findByCourseBySkillIdSortedByProficiency(
            @Param("skillId") long skillId,
            @Param("recommendedSkillLevels") List<String> recommendedSkillLevels, // List of levels to filter
            @Param("filterBySkillLevel") Optional<String> filterBySkillLevel,
            Pageable pageable);
}
