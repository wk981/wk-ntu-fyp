package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.WorkEnvironment;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name="career")
@Builder
@Setter
@Getter
public class Career extends SuperClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="career_id")
    private long career_id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String sector;

    @Enumerated(EnumType.STRING)
    @Column(name="career_level")
    private CareerLevel careerLevel;

    @Enumerated(EnumType.STRING)
    @Column(name="work_environment",columnDefinition = "TEXT")
    private WorkEnvironment workEnvironment;

    @Column(columnDefinition = "TEXT")
    private String goal;

    private String pic;
    private String branch;

    @OneToMany(mappedBy = "career")
    private Set<CareerSkills> careerSkills;
}
