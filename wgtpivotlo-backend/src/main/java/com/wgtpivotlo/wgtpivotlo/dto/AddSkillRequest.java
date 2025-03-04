package com.wgtpivotlo.wgtpivotlo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class AddSkillRequest {
    @NotNull(message = "Name cannot be null")
    @NotBlank(message= "Name cannot be blank")
    private String name;

    @NotNull(message = "Description cannot be null")
    @NotBlank(message= "Description cannot be blank")
    private String description;

}
