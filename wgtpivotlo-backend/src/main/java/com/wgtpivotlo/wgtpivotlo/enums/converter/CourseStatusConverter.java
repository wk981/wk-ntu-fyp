package com.wgtpivotlo.wgtpivotlo.enums.converter;

import com.wgtpivotlo.wgtpivotlo.enums.CourseStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.stream.Stream;

@Converter(autoApply = true)
public class CourseStatusConverter implements AttributeConverter<CourseStatus, String> {
    @Override
    public String convertToDatabaseColumn(CourseStatus attribute) {
        if (attribute == null){
            return null;
        }
        return attribute.getLevel();
    }

    @Override
    public CourseStatus convertToEntityAttribute(String dbData) {
        if (dbData == null){
            return null;
        }

        return Stream.of(CourseStatus.values())
                .filter(c -> c.getLevel().equals(dbData))  // Match against custom level label
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown course status: " + dbData));
    }
}
