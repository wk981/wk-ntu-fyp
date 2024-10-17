package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.service.SkillService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/skill")
public class SkillController {

    private final SkillService skillService;

    @Autowired
    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

//    @GetMapping(name = "/")
//    public List<Skill> getSkills(){
//        return skillService.findAll();
//    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getPaginatedSkills(
            @RequestParam(defaultValue = "1") @Min(1) int pageNumber,
            @RequestParam(defaultValue = "10") @Min(1) @Max(15) int pageSize){
        Map<String, Object> responseBody = skillService.findAllPagination(pageNumber,pageSize);
        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/{id}")
    public Optional<Skill> getSkillId(@PathVariable long id){
        return skillService.findId(id);
    }

}
