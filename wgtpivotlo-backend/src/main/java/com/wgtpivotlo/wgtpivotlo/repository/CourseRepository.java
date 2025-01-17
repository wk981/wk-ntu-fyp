package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    @Query(value = "SELECT c.* FROM course c INNER JOIN course_skill cs ON c.course_id = cs.course_id WHERE cs.skill_id = :skillId",
            countQuery = "SELECT count(c.*) FROM course c INNER JOIN course_skill cs ON c.course_id = cs.course_id WHERE cs.skill_id = :skillId",
            nativeQuery = true)
    Page<Course> findByCourseBySkillIdPaginated(long skillId, Pageable pageable);
}
