package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill,Long> {
    List<Skill> findByNameContainingIgnoreCase(String name);

    @Query(value = "SELECT s.* " +
            "FROM skill s " +
            "WHERE lower(s.name) ILIKE CONCAT('%', :name, '%') " +  // Partial match with ILIKE
            "   OR similarity(lower(REPLACE(s.name, ' ', '')), :name) > 0.6 " + // Similarity threshold
            "ORDER BY similarity(lower(REPLACE(s.name, ' ', '')), :name) DESC " +  // Best match first
            "LIMIT 1",  // Get the best match only
            nativeQuery = true)
    Skill findNameUsingTriageAndIgnoreCase(@Param("name") String name);
}
