package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_skill")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserSkills {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name="skill_id")
    private Skill skill;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name="profiency")
    private SkillLevel profiency;
}
