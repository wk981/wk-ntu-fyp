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

    public double toWeightedDouble(){
        return switch (level) {
            case "Entry Level" -> 0.25;
            case "Mid Level" -> 0.5;
            case "Senior Level" -> 1;
            default -> throw new IllegalArgumentException("Invalid career-level: " + level);
        };
    }

    public int toInt(){
        return switch (level){
            case "Entry Level" -> 1;
            case "Mid Level" -> 2;
            case "Senior Level" -> 3;
            default -> throw new IllegalArgumentException("Invalid career-level: " + level);
        };
    }

}
