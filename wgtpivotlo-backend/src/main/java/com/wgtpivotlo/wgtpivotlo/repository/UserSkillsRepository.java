package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.model.UserSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillsRepository extends JpaRepository<UserSkills, Long> {

    @Modifying
    @Query(value="DELETE FROM user_skill us WHERE us.user_id = :userId", nativeQuery = true)
    void deleteByUserId(@Param("userId") Long userId);

    @Query(value="SELECT us.* FROM user_skill us WHERE us.user_id = :userId",nativeQuery = true)
    Optional<List<UserSkills>> findByUserId(@Param("userId") Long userId);

    @Modifying
    @Query(value="INSERT INTO user_skill (user_id, skill_id, profiency) VALUES (:userId, :skillId, :profiency)", nativeQuery = true)
    void insertByUserIdAndSkillIdAndProfiency(@Param("userId")Long userId, @Param("skillId") Long skillId, @Param("profiency") String profiency);
}
