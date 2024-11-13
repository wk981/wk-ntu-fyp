package com.wgtpivotlo.wgtpivotlo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
    private String pic_url;

    public Skill(Skill skill) {
        super();
        this.skillId = skill.getSkillId();
        this.name = skill.getName();
        this.description = skill.getDescription();
        this.pic_url = skill.getDescription();
    }
}
