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

    @Query(value="SELECT us.* FROM user_skill us WHERE us.user_id = :userId AND us.skill_id = :skillId LIMIT 1",nativeQuery = true)
    Optional<UserSkills> findByUserIdAndSkillId(@Param("userId") Long userId, @Param("skillId") Long skillId);

    @Modifying
    @Query(value="INSERT INTO user_skill (user_id, skill_id, profiency) VALUES (:userId, :skillId, :profiency)", nativeQuery = true)
    void insertByUserIdAndSkillIdAndProfiency(@Param("userId")Long userId, @Param("skillId") Long skillId, @Param("profiency") String profiency);

    @Modifying
    @Query(value="UPDATE user_skill SET profiency=:profiency WHERE user_id = :userId AND skill_id = :skillId", nativeQuery = true)
    void updateByUserIdAndSkillIdAndProfiency(@Param("userId")Long userId, @Param("skillId") Long skillId, @Param("profiency") String profiency);
}
