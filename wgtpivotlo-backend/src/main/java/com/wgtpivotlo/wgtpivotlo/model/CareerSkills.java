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

    @JsonIgnoreProperties("careerSkills") // Ignore back reference to CareerSkills from Skill
    @ManyToOne
    @JoinColumn(name="skill_id")
    private Skill skill;

    @JsonIgnoreProperties("careerSkills") // Ignore back reference to CareerSkills from Career
    @ManyToOne
    @JoinColumn(name="career_id")
    private Career career;

    @Enumerated(EnumType.STRING)
    @Column(name="skill_level")
    private SkillLevel skillLevel;

    @Min(1)
    @Max(5)
    @Column(name="skill_weight",nullable = true)
    private Integer skillWeight;
}
