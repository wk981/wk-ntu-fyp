package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.service.SkillService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            @RequestParam(defaultValue = "10") @Min(1) int pageSize,
            @RequestParam(required = false) String name){
        return ResponseEntity.ok(skillService.findAllPagination(pageNumber,pageSize, Optional.ofNullable(name)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillId(@PathVariable long id){
        return ResponseEntity.ok(skillService.findId(id));
    }

    @PostMapping("/")
    public ResponseEntity<MessageDTO> createSkill(@RequestPart("skillBody") @Valid AddSkillRequest request, @RequestPart("thumbnail") MultipartFile thumbnail) throws BadRequestException {
        skillService.createSkill(request, thumbnail);
        MessageDTO msg = MessageDTO.builder().message("Success").build();
        return ResponseEntity.status(HttpStatus.CREATED).body(msg);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageDTO> updateSkill(@RequestPart("skillBody") UpdateSkillRequest request, @RequestPart("thumbnail") MultipartFile thumbnail, @PathVariable long id) throws BadRequestException {
        skillService.updateSkill(request, thumbnail, id);
        MessageDTO msg = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(msg);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageDTO> deleteSkill(@PathVariable long id){
        skillService.deleteCareerId(id);
        MessageDTO msg = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Skill>> findSkill(@RequestParam String q){
        return ResponseEntity.ok(skillService.findSkill(q));
    }

}
