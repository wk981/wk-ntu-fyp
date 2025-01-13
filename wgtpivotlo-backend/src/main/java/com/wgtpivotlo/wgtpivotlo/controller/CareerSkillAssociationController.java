package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.service.CareerRecommendationService;
import com.wgtpivotlo.wgtpivotlo.service.CareerSkillAssociationService;
import com.wgtpivotlo.wgtpivotlo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/career-skill-association")
public class CareerSkillAssociationController {
    private final CareerSkillAssociationService careerSkillAssociationService;
    private final CareerRecommendationService careerRecommendationService;
    private final UserService userService;

    @Autowired
    public CareerSkillAssociationController(CareerSkillAssociationService careerSkillAssociationService, CareerRecommendationService careerRecommendationService, UserService userService) {
        this.careerSkillAssociationService = careerSkillAssociationService;
        this.careerRecommendationService = careerRecommendationService;
        this.userService = userService;
    }

    @GetMapping("/career/{career_id}")
    public ResponseEntity<Optional<CareerWithSkillsDTO>> getCareerAssiocationId(@PathVariable long career_id){
        Optional<CareerWithSkillsDTO> result = careerSkillAssociationService.findByCareerId(career_id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/career/recommendations")
    public ResponseEntity<PageDTO<CareerWithSimilarityScoreDTO>> getMoreTypedResult(@RequestBody CareerRecommendationDTO request, Authentication authentication) throws AccessDeniedException {
        PageDTO<CareerWithSimilarityScoreDTO> res = careerRecommendationService.getRecommendedCareers(request, authentication);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/career/preference/{career_id}")
    public ResponseEntity<HashMap<String, String>> setCareerPreference(@PathVariable long career_id, Authentication authentication) throws AccessDeniedException{
        userService.setCareerPreference(career_id, authentication);
        HashMap<String, String> res = new HashMap<>();
        res.put("message", "Career set successfully");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/career/preference")
    public ResponseEntity<HashMap<String, Long>> getUserPreferenceCareerId(Authentication authentication) throws AccessDeniedException{
        return ResponseEntity.ok(userService.getUserPreferenceCareer(authentication));
    }
}
