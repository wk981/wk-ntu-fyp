package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.CourseSource;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name="course")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Course extends SuperClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="course_id")
    private long course_id;

    @Column(nullable = false)
    private String name;

    @Column(name="link")
    private String link;

    private float rating;
    private float reviews_counts;

    @Enumerated(EnumType.STRING)
    @Column(name = "course_source", length = 20)
    private CourseSource courseSource;
}
