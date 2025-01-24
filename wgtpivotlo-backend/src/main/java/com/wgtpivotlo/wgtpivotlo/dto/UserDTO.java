package com.wgtpivotlo.wgtpivotlo.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Builder
public class UserDTO {
    private long id;
    private String email;
    private String username;
    private List<String> role;
    private String pic;
    private Boolean isCareerPreferenceSet;
}
