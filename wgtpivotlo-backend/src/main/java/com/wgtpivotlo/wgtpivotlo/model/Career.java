package com.wgtpivotlo.wgtpivotlo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.WorkEnvironment;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

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

    @Enumerated(EnumType.STRING)
    @Column(name="career_level")
    private CareerLevel careerLevel;

    private String pic_url;
    
}
