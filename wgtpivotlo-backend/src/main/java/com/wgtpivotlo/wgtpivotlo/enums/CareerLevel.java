package com.wgtpivotlo.wgtpivotlo.enums;

public enum CareerLevel {
    ENTRY_LEVEL("Entry Level"),
    MID_LEVEL("Mid Level"),
    SENIOR_LEVEL("Senior Level");

    private final String level;

    CareerLevel(String level){
        this.level = level;
    }

    public String getlevel(){
        return this.level;
    }
}
