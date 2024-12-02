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
public interface CareerSkillAssociationRepository extends JpaRepository<CareerSkills, Long>, CareerSkillAssociationRepositoryCustom {
    Optional<List<CareerSkills>> findByCareer(Optional<Career> career);

    @Query(value = "SELECT * FROM career_skill cs WHERE cs.career_id IN :careerIds",nativeQuery = true)
    List<CareerSkills> findByCareerIdsNative(@Param("careerIds") List<Long> careerIds);

}
