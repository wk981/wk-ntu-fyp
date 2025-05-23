package com.wgtpivotlo.wgtpivotlo.repository;

import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import com.wgtpivotlo.wgtpivotlo.model.User;
import com.wgtpivotlo.wgtpivotlo.model.UserCourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCourseHistoryRepository  extends JpaRepository<UserCourseHistory, Long> {
    @Query(value = "SELECT uh.* FROM user_history uh WHERE user_id = :userId AND course_id = :courseId" , nativeQuery = true)
    Optional<UserCourseHistory> findByUserIdAndCourseId(@Param("userId") long userId,@Param("courseId") long courseId);

    Optional<List<UserCourseHistory>> findByUser(User user);

    @Query(value = "SELECT * FROM user_history uh WHERE uh.user_id = :userId AND (:courseStatus IS NULL OR uh.course_completion_status = :courseStatus)", nativeQuery = true)
    Optional<List<UserCourseHistory>> findByUserIdAndCourseStatus(@Param("userId") long userId, @Param("courseStatus") Optional<String> courseStatus);
}
