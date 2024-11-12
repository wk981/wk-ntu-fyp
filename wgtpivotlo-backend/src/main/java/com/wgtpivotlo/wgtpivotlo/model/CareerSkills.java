package com.wgtpivotlo.wgtpivotlo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(name = "career_skill")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CareerSkills {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name="skill_id")
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name="profiency")
    private SkillLevel profiency;

    @ManyToOne
    @JoinColumn(name = "career_id")
    private Course course;
}
