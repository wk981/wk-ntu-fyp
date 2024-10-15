package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.CourseSource;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.Set;

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

    @Column(name="course_original_link")
    private String courseOriginalLink;

    @Enumerated(EnumType.STRING)
    @Column(name="course_source")
    private CourseSource courseSource;

    @ManyToOne
    @JoinColumn(name="career_id", referencedColumnName = "career_id")
    private Career career;

    @OneToMany(mappedBy = "course")
    private Set<CourseSkills> courseSkills;

}
