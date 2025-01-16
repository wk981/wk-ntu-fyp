package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.model.Career;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerRepository extends JpaRepository<Career,Long> {
    @Query(value = "SELECT distinct (c.sector) FROM career c", nativeQuery = true)
    List<String> findAllCareer();

    @Query(value = "SELECT c.* FROM career c INNER JOIN \"_user\" u ON u.career_id = c.career_id WHERE u.user_ID = :userId;",nativeQuery = true)
    Optional<Career> findUserCareer(long userId);
}
