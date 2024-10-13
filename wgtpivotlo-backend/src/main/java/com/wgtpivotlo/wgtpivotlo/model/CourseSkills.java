package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="course_skill")
@Builder
@Setter
@Getter
public class CourseSkills {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name="course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name="skill_id")
    private Skill skill;

    private String skill_earn_level;
    private String skill_recommended_level;
}
