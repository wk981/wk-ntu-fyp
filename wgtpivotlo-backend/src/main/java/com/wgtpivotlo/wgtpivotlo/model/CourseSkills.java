package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name="course_skill")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CourseSkills extends SuperClass{
    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name="profiency")
    private SkillLevel profiency;

    @ManyToOne
    @JoinColumn(name="skill_id")
    private Skill skill;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}
