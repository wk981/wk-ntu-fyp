package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CareerRepository extends JpaRepository<Career,Long> {
    @Query(value = "SELECT distinct (c.sector) FROM career c", nativeQuery = true)
    List<String> findAllCareer();

    @Query(value = "SELECT c.* FROM career c INNER JOIN \"_user\" u ON u.career_id = c.career_id WHERE u.user_ID = :userId;",nativeQuery = true)
    Optional<Career> findUserCareer(long userId);

    @Query(value = "Select c.* FROM career c where c.career_id = :careerId", nativeQuery = true)
    Career findByCareerId(@Param("careerId") Long careerId);

    @Query(value = "SELECT c.* FROM career c WHERE c.career_id IN (:careerIds)", nativeQuery = true)
    List<Career> findAllByCareerId(@Param("careerIds") List<Long> careerIds);

    @Query(value = "SELECT DISTINCT c.* FROM career_skill cs INNER JOIN career c ON c.career_id = cs.career_id WHERE cs.skill_id in (:skillIds)", nativeQuery = true)
    List<Career> findCareerSkillsBySkillIds(@Param("skillIds") List<Long> skillIds);

    List<Career> findAll(Specification<Career> specification);

    Page<Career> findAll(Specification<Career> specification, Pageable pageable);
}