package com.wgtpivotlo.wgtpivotlo.model;

import com.wgtpivotlo.wgtpivotlo.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name="_user")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class User extends SuperClass{

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name="user_id", nullable = true)
    private long user_id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name="role")
    private Role role;

    @Column(name="career_id", nullable = true)
    private Long careerId;

    private String pic;
}
