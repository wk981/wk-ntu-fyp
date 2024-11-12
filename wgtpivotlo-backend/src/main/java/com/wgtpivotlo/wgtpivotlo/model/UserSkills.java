package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_skill")
@Builder
@Setter
@Getter
public class UserSkills {

    @Id
    private Long id;
}
