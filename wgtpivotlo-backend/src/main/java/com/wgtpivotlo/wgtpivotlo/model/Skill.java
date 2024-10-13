package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name="skill")
@Builder
@Setter
@Getter
public class Skill extends SuperClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="skill_id")
    private long skill_id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String pic;

    @OneToMany(mappedBy = "skill")
    private Set<UserSkills> userSkills;

    @OneToMany(mappedBy = "skill")
    private Set<CareerSkills> careerSkills;

    @OneToMany(mappedBy = "skill")
    private Set<CourseSkills> courseSkills;
}
