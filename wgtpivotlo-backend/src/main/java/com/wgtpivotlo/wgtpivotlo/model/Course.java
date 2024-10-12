package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Course extends SuperClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="course_id")
    private long course_id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String course_original_link;
    private String course_source;

    @ManyToOne
    @JoinColumn(name="career_id", referencedColumnName = "career_id")
    private Career career;

}
