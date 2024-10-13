package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_skill")
@Builder
@Setter
@Getter
public class UserSkills {

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="skill_id")
    private Skill skill;

    private String skill_level;
}
