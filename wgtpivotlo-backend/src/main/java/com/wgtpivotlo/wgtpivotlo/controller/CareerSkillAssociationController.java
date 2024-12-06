package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSimilarityScoreDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.QuestionaireRequest;
import com.wgtpivotlo.wgtpivotlo.service.CareerRecommendationService;
import com.wgtpivotlo.wgtpivotlo.service.CareerSkillAssociationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Optional<CareerWithSkillsDTO>> getCareerAssiocationId(@PathVariable long career_id){
        Optional<CareerWithSkillsDTO> result = careerSkillAssociationService.findByCareerId(career_id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/career/recommendations")
    public ResponseEntity<PageDTO<CareerWithSimilarityScoreDTO>> getRecommendedCareers(@RequestBody QuestionaireRequest questionaireRequest){
        PageDTO<CareerWithSimilarityScoreDTO> res = careerRecommendationService.getRecommendedCareers(questionaireRequest.getPageNumber(), questionaireRequest.getPageSize(), questionaireRequest.getCareerSkillDTOList());
        return ResponseEntity.ok(res);
    }

}
