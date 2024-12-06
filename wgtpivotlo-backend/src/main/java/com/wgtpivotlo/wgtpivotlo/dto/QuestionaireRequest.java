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
    private String industry;
    private CareerLevel careerLevel;
    private List<CareerSkillDTO> careerSkillDTOList;
    public QuestionaireRequest(String industry, CareerLevel careerLevel, List<CareerSkillDTO> careerSkillDTOList){
        this.industry = industry;
        this.careerLevel = careerLevel;
        this.careerSkillDTOList = careerSkillDTOList;
    }
}
