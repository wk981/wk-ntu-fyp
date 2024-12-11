package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.Choice;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CareerRecommendationRequest extends QuestionaireRequest{
    private Choice choice;

    public CareerRecommendationRequest(Choice choice){
        this.choice = choice;
    }

}
