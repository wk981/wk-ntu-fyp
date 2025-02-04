package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import com.wgtpivotlo.wgtpivotlo.model.UserCourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCourseHistoryRepository  extends JpaRepository<UserCourseHistory, Long> {
    @Query(value = "SELECT uh.* FROM user_history uh WHERE user_id = :userId AND course_id = :courseId" , nativeQuery = true)
    Optional<UserCourseHistory> findByUserIdAndCourseId(@Param("userId") long userId,@Param("courseId") long courseId);
}
