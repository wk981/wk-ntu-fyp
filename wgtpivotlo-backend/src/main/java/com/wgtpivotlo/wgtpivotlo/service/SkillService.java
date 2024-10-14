package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.repository.SkillRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@Service
@Slf4j
public class SkillService {
    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }


    public List<Skill> findAll(){
        List<Skill> skillsList = skillRepository.findAll();
        log.info("Fetching all of the skills");
        log.info(skillsList.toString());
        if (skillsList.isEmpty()){
            log.warn("No skills found in the database");
            throw new ResourceNotFoundException("No skill found in the database");
        }
        return skillsList;
    }
}
