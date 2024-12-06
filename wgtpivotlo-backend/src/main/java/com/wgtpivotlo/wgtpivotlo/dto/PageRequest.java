package com.wgtpivotlo.wgtpivotlo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PageRequest {
    private int pageNumber;
    private int pageSize;

    public PageRequest(int pageNumber, int pageSize){
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
