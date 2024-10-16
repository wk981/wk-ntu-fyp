package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name="skill")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Skill extends SuperClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="skill_id")
    private long skillId;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String pic;
    private String type;

    @OneToMany(mappedBy = "skill")
    private Set<UserSkills> userSkills;

    @OneToMany(mappedBy = "skill")
    private Set<CareerSkills> careerSkills;

    @OneToMany(mappedBy = "skill")
    private Set<CourseSkills> courseSkills;
}
