package com.wgtpivotlo.wgtpivotlo.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CareerLevel {
    ENTRY_LEVEL("Entry Level"),
    MID_LEVEL("Mid Level"),
    SENIOR_LEVEL("Senior Level");

    private final String level;

    CareerLevel(String level){
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
