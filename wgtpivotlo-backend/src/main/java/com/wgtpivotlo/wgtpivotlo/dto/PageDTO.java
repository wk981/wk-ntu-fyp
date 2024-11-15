package com.wgtpivotlo.wgtpivotlo.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PageDTO<T> {
    private int totalPage;
    private int pageNumber;
    private List<T> data;

    public PageDTO(int totalPage, int pageNumber, List<T> data) {
        this.totalPage = totalPage;
        this.pageNumber = pageNumber;
        this.data = data;
    }
}
