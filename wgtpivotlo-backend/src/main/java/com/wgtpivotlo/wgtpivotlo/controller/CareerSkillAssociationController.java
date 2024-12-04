package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSimilarityScoreDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSkillCount;
import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSkillDTO;
import com.wgtpivotlo.wgtpivotlo.service.CareerRecommendationService;
import com.wgtpivotlo.wgtpivotlo.service.CareerSkillAssociationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/career-skill-association")
public class CareerSkillAssociationController {
    private final CareerSkillAssociationService careerSkillAssociationService;
    private final CareerRecommendationService careerRecommendationService;

    @Autowired
    public CareerSkillAssociationController(CareerSkillAssociationService careerSkillAssociationService, CareerRecommendationService careerRecommendationService) {
        this.careerSkillAssociationService = careerSkillAssociationService;
        this.careerRecommendationService = careerRecommendationService;
    }

    @GetMapping("/career/{career_id}")
    public ResponseEntity<Optional<CareerWithSkillDTO>> getCareerAssiocationId(@PathVariable long career_id){
        Optional<CareerWithSkillDTO> result = careerSkillAssociationService.findByCareerId(career_id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/career/recommendations")
    public ResponseEntity<Page<Object>> getRecommendedCareers(){
        Page<Object> res = careerRecommendationService.getRecommendedCareers();
        return ResponseEntity.ok(res);
    }
}
