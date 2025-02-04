package com.wgtpivotlo.wgtpivotlo.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CourseStatus {
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    NOT_DONE("Not Done"),
    ;

    private final String level;

    CourseStatus(String level) {
        this.level = level;
    }

    @JsonValue  // Use this field for JSON serialization
    public String getLevel() {
        return this.level;
    }

    @Override
    public String toString() {
        return this.level;
    }
}
