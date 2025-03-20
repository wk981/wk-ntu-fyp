package com.wgtpivotlo.wgtpivotlo.utils;

import com.wgtpivotlo.wgtpivotlo.dto.SkillIdWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class FiltersHelper {

    public static List<SkillIdWithProfiencyDTO> extractSkillIdWithProfiencyDTO(String skillFilters) throws BadRequestException {
        List<SkillIdWithProfiencyDTO> res = new ArrayList<>();
        if(skillFilters!= null && !skillFilters.trim().isEmpty()){
            String[] filterPairs = skillFilters.split(",");

            for(String pair: filterPairs){
                String[] parts = pair.split(":");
                if (parts.length == 0 || parts[0].trim().isEmpty()) {
                    System.err.println("Invalid skill filter: " + pair + " (Missing Skill ID)");
                    continue; // Skip this entry if the Skill ID is missing
                }
                Long skillId = Long.parseLong(parts[0].trim()); // Validate that Skill ID is a Long
                String profiencyString = parts.length > 1 ? parts[1].trim() : "";
                SkillLevel profiency;
                if(profiencyString.isEmpty()){
                    profiency = null;
                }
                else{
                    profiency = SkillLevel.valueOf(profiencyString);
                }
                res.add(new SkillIdWithProfiencyDTO(skillId, profiency));
            }
        }
        System.out.println(res.toString());
        return res;
    }
}
