package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CareerSkillListDTO {
    private long career_id;
    private String title;
    private String sector;
    private String responsibility;
    private CareerLevel careerLevel;
    private String pic_url;
    private List<CareerSkillWithProfiencyDTO> skillsWithProfiency;

    public CareerSkillListDTO(List<CareerSkillWithProfiencyDTO> skillsWithProfiency,Long career_id,String title,String sector,String responsibility,CareerLevel careerLevel,String pic_url) {
        this.skillsWithProfiency = skillsWithProfiency;
        this.career_id = career_id;
        this.title = title;
        this.sector = sector;
        this.responsibility = responsibility;
        this.careerLevel = careerLevel;
        this.pic_url = pic_url;
    }
}
