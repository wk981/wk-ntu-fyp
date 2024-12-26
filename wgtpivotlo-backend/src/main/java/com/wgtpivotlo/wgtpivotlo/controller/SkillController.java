package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.service.SkillService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/skill")
public class SkillController {

    private final SkillService skillService;

    @Autowired
    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/")
    public ResponseEntity<PageDTO<SkillDTO>> getPaginatedSkills(
            @RequestParam(defaultValue = "1") @Min(1) int pageNumber,
            @RequestParam(defaultValue = "10") @Min(1) int pageSize){
        PageDTO<SkillDTO> responseBody = skillService.findAllPagination(pageNumber,pageSize);
        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/{id}")
    public Optional<Skill> getSkillId(@PathVariable long id){
        return skillService.findId(id);
    }

    @PostMapping("/")
    public ResponseEntity<String> createNewSkill(){
        return ResponseEntity.status(201).body("Created");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Skill>> findSkill(@RequestParam String q){
        return ResponseEntity.ok(skillService.findSkill(q));
    }

}
