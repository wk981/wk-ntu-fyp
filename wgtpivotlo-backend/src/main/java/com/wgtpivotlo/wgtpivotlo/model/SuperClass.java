package com.wgtpivotlo.wgtpivotlo.model;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Date;

// Ref: https://stackoverflow.com/questions/49954812/how-can-you-make-a-created-at-column-generate-the-creation-date-time-automatical
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Setter
@Getter
public abstract class SuperClass {

    @CreatedDate
    @Column(name="created_on", nullable = false, updatable = false)
    private Date created_on;

    @LastModifiedDate
    @Column(name="updated_on", nullable = false, updatable = false)
    private LocalDateTime updated_on;
}
