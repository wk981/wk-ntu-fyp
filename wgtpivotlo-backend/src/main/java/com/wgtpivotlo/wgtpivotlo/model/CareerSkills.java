package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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

    @Enumerated(EnumType.STRING)
    @Column(name="skill_level")
    private SkillLevel skillLevel;

    @Min(1)
    @Max(5)
    @Column(name="skill_weight")
    private int skillWeight;
}
