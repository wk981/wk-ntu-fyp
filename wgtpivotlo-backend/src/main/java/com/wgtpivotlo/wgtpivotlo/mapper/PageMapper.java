package com.wgtpivotlo.wgtpivotlo.mapper;

import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Builder
@Component
public class PageMapper<T> {

    public PageDTO PageableToPageDTO(Page<T> paginatedResult){
        int totalPages = paginatedResult.getTotalPages();
        int currentPage = paginatedResult.getPageable().getPageNumber();
        return PageDTO.builder().pageNumber(currentPage).pages(totalPages).build();
    }

}
