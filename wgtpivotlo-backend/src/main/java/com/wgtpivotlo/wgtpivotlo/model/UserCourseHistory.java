package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="user_history")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserCourseHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_history_id")
    private long userHistoryId;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="course_id")
    private Course course;

    @Column(name="course_completion_status")
    private CourseStatus courseStatus;
}
