package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import jakarta.annotation.Nullable;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UpdateCareerRequest {
    @Nullable
    private String title;

    @Nullable
    private String sector;

    @Nullable
    private String responsibility;

    @Nullable
    private CareerLevel careerLevel;
}
