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
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String responsibility;
    private String sector;

    @Enumerated(EnumType.STRING)
    @Column(name="career_level")
    private CareerLevel careerLevel;
    private String branch;

    @Enumerated(EnumType.STRING)
    @Column(name="work_environment",columnDefinition = "TEXT")
    private WorkEnvironment workEnvironment;

    @Column(name="career_goal",columnDefinition = "TEXT")
    private String careerGoal;

    private String pic;


    @OneToMany(mappedBy = "career")
    @JsonIgnoreProperties("career")  // Ignore career in CareerSkills to prevent circular reference
    private Set<CareerSkills> careerSkills;
}
