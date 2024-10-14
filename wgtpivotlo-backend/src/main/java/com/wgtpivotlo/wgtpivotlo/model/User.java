package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.Role;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name="_user")
@Getter
@Setter
@Builder
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

    @Enumerated(EnumType.STRING)
    @Column(name="role")
    private Role role;

    private String pic;

    // Why many to one cus many users can have the same career
    @ManyToOne
    @JoinColumn(name="career_id", referencedColumnName = "career_id")
    private Career career;

    @OneToMany(mappedBy = "user")
    private Set<UserSkills> userSkills;

}
