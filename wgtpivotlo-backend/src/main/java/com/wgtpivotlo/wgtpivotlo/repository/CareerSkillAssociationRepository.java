package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Inherit jparepo and customRepository(that contains criteria API for complex queries)
@Repository
public interface CareerSkillAssociationRepository extends JpaRepository<CareerSkills, Long> {
    Optional<List<CareerSkills>> findByCareer(Optional<Career> career);

    @Query(value = "SELECT * FROM career_skill cs WHERE cs.career_id IN :careerIds",nativeQuery = true)
    Optional<List<CareerSkills>> findByCareerIdsNative(@Param("careerIds") List<Long> careerIds);

    @Query(value = "SELECT cs.skill_id FROM career_skill cs WHERE cs.career_id = :careerId", nativeQuery = true)
    Optional<List<Long>> findSkillsIdByCareerId(@Param("careerId") Long careerId);

    @Query(value = "SELECT cs.* FROM career_skill cs WHERE cs.career_id = :careerId AND cs.skill_id = :skillId", nativeQuery = true)
    Optional<CareerSkills> findCareerSkillsByCareerIdAndSkillId(@Param("careerId") Long careerId, @Param("skillId") Long skillId);

    Optional<CareerSkills> findById(Long id);

}
