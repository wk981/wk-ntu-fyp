package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.model.Skill;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SkillDTO {
    private long skillId;
    private String name;
    private String description;
    private String pic;

    public SkillDTO(Skill skill) {
        this.skillId = skill.getSkillId();
        this.name = skill.getName();
        this.description = skill.getDescription();
        this.pic = skill.getPic_url();
    }
}
