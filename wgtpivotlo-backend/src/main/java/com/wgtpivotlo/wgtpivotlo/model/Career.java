package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
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
    private String career_level;

    @Column(columnDefinition = "TEXT")
    private String work_environment;

    @Column(columnDefinition = "TEXT")
    private String goal;
    private String pic;


}
