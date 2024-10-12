package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class User extends SuperClass{

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private long user_id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    private String role;
    private String pic;

    // Why many to one cus many users can have the same career
    @ManyToOne
    @JoinColumn(name="career_id", referencedColumnName = "career_id")
    private Career career;

}
