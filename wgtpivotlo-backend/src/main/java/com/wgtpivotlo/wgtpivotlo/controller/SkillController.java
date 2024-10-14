package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.service.SkillService;
import org.hibernate.query.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping(path = "${apiPrefix}/v1/skill")
public class SkillController {

    private final SkillService skillService;

    @Autowired
    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping(name = "/")
    public List<Skill> getSkills(){
        return skillService.findAll();
    }

}
