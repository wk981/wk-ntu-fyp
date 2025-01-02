package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.model.Career;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerRepository extends JpaRepository<Career,Long> {
    @Query(value = "SELECT distinct (c.sector) FROM career c", nativeQuery = true)
    List<String> findAllCareer();
}
