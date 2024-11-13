package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.converter.CareerLevelConverter;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="career")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Career extends SuperClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="career_id")
    private long career_id;

    @Column(nullable = false)
    private String title;

    private String sector;
    private String responsibility;

    @Convert(converter = CareerLevelConverter.class)
    @Column(name="career_level")
    private CareerLevel careerLevel;

    private String pic_url;
    
}
