package com.wgtpivotlo.wgtpivotlo.enums.converter;

import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.stream.Stream;

@Converter(autoApply = true)
public class CareerLevelConverter implements AttributeConverter<CareerLevel, String> {

    @Override
    public String convertToDatabaseColumn(CareerLevel careerLevel) {
        if (careerLevel == null){
            return null;
        }
        return careerLevel.getLevel();
    }

    @Override
    public CareerLevel convertToEntityAttribute(String dbData) {
        if (dbData == null){
            return null;
        }

        return Stream.of(CareerLevel.values())
                .filter(c -> c.getLevel().equals(dbData))  // Match against custom level label
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown career level: " + dbData));
    }
}
