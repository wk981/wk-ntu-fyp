package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "career_skill")
@Builder
@Setter
@Getter
public class CareerSkills {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name="skill_id")
    private Skill skill;

    @ManyToOne
    @JoinColumn(name="career_id")
    private Career career;

    private String skill_level;
}
