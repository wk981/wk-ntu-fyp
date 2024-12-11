package com.wgtpivotlo.wgtpivotlo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Data
public class PageRequest {
    @Min(value = 1, message = "Page number must be more than 1")
    private int pageNumber;

    @Min(value = 5, message = "Page size must be more than 5")
    private int pageSize;

    public PageRequest(int pageNumber, int pageSize){
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
