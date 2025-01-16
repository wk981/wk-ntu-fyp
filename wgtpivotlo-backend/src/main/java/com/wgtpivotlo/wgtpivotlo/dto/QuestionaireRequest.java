package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class QuestionaireRequest extends PageRequest{
    private String sector;
    private CareerLevel careerLevel;
    private List<SkillIdWithProfiencyDTO> skillIdWithProfiencyDTOList;
    public QuestionaireRequest(String sector, CareerLevel careerLevel, List<SkillIdWithProfiencyDTO> skillIdWithProfiencyDTOList){
        this.sector = sector;
        this.careerLevel = careerLevel;
        this.skillIdWithProfiencyDTOList = skillIdWithProfiencyDTOList;
    }
}
