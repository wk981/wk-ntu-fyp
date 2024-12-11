package com.wgtpivotlo.wgtpivotlo.enums;

public enum SkillLevel {
    Beginner("Beginner"),
    Intermediate("Intermediate"),
    Advanced("Advanced");

    private final String level;

    SkillLevel(String level) {
        this.level = level;
    }

    public int toInt(){
        return switch (level){
            case "Beginner" -> 1;
            case "Intermediate" -> 2;
            case "Advanced" -> 3;
            default -> throw new IllegalArgumentException("Invalid career-level: " + level);
        };
    }

    public double toWeightedDouble(){
        return switch (level){
            case "Beginner" -> 0.25;
            case "Intermediate" -> 0.5;
            case "Advanced" -> 1;
            default -> throw new IllegalArgumentException("Invalid proficiency: " + level);
        };
    }
}
