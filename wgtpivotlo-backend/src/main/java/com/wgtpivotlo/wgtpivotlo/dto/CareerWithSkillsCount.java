package com.wgtpivotlo.wgtpivotlo.dto;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CareerWithSkillsCount {
    private long careerId;
    private String title;
    private String sector;
    private String responsibility;
    private CareerLevel careerLevel;
    private String pic_url;
    private int count;

}
