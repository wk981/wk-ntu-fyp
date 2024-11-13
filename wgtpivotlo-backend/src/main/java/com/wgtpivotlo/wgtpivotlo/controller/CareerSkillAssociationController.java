package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillListDTO;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.service.CareerSkillAssociationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/career-skill-association")
public class CareerSkillAssociationController {
    private final CareerSkillAssociationService careerSkillAssociationService;

    @Autowired
    public CareerSkillAssociationController(CareerSkillAssociationService careerSkillAssociationService) {
        this.careerSkillAssociationService = careerSkillAssociationService;
    }

    @GetMapping("/career/{career_id}")
    public ResponseEntity<Optional<CareerSkillListDTO>> getCareerAssiocationId(@PathVariable long career_id){
        Optional<CareerSkillListDTO> result = careerSkillAssociationService.findByCareerId(career_id);
        return ResponseEntity.ok(result);
    }
}
