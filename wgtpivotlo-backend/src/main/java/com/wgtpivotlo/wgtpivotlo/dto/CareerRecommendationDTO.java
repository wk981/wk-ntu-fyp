package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.Choice;
import jakarta.validation.constraints.Null;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CareerRecommendationDTO extends PageRequest{
    private Choice type;
    private String sector;
    private CareerLevel careerLevel;
}
