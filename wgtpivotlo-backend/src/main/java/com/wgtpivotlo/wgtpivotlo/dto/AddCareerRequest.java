package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class AddCareerRequest {
    @NotNull(message = "Title cannot be null")
    @NotBlank(message="Title cannot be blank")
    private String title;

    @NotNull(message = "Sector cannot be null")
    @NotBlank(message="Sector cannot be blank")
    private String sector;

    @NotNull(message = "Responsibility cannot be null")
    @NotBlank(message="Responsibility cannot be blank")
    private String responsibility;

    @NotNull(message = "CareerLevel cannot be null")
    private CareerLevel careerLevel;
}
