package com.wgtpivotlo.wgtpivotlo.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.mapper.MappingUtils;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.service.CareerRecommendationService;
import com.wgtpivotlo.wgtpivotlo.service.CareerSkillAssociationService;
import com.wgtpivotlo.wgtpivotlo.service.UserService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/career-skill-association")
public class CareerSkillAssociationController {
    private final CareerSkillAssociationService careerSkillAssociationService;
    private final CareerRecommendationService careerRecommendationService;
    private final UserService userService;
    private final MappingUtils mappingUtils;

    @Autowired
    public CareerSkillAssociationController(CareerSkillAssociationService careerSkillAssociationService, CareerRecommendationService careerRecommendationService, UserService userService, MappingUtils mappingUtils) {
        this.careerSkillAssociationService = careerSkillAssociationService;
        this.careerRecommendationService = careerRecommendationService;
        this.userService = userService;
        this.mappingUtils = mappingUtils;
    }

    @PostMapping("/")
    public ResponseEntity<MessageDTO> addCareerSkill(@RequestBody CareerSkillsDTO careerSkillsDTO) throws BadRequestException {
        careerSkillAssociationService.addCareerSkill(careerSkillsDTO);
        MessageDTO messageDTO = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(messageDTO);
    }

    @PutMapping("/")
    public ResponseEntity<MessageDTO> editCareerSkill(@RequestBody CareerSkillsDTO careerSkillsDTO) throws BadRequestException {
        careerSkillAssociationService.editCareerSkill(careerSkillsDTO);
        MessageDTO messageDTO = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(messageDTO);
    }

    @DeleteMapping("/")
    public ResponseEntity<MessageDTO> deleteCareerSkill(@RequestBody CareerSkillsDTO careerSkillsDTO) throws BadRequestException {
        careerSkillAssociationService.deleteCareerSkill(careerSkillsDTO);
        MessageDTO messageDTO = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(messageDTO);
    }

    @GetMapping("/career/{career_id}")
    public ResponseEntity<Optional<CareerWithSkillsDTO>> getCareerAssiocationId(@PathVariable long career_id, Authentication authentication){
        Optional<CareerWithSkillsDTO> result = careerSkillAssociationService.findByCareerId(career_id, authentication);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/career/recommendations")
    public ResponseEntity<PageDTO<CareerWithSimilarityScoreDTO>> getMoreTypedResult(@RequestBody CareerRecommendationDTO request, Authentication authentication) throws AccessDeniedException {
        PageDTO<CareerWithSimilarityScoreDTO> res = careerRecommendationService.getRecommendedCareers(request, authentication);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/career/recommendation-exploration")
    public ResponseEntity<HashMap<String, PageDTO<CareerWithSimilarityScoreDTO>>> getRecommendationExploreOtherCareer(@RequestBody PageRequest request, Authentication authentication) throws JsonProcessingException, AccessDeniedException {
        return ResponseEntity.ok(careerRecommendationService.getRecommendationExploreOtherCareer(request, authentication));
    }

    @PostMapping("/career/preference/{career_id}")
    public ResponseEntity<HashMap<String, String>> setCareerPreference(@PathVariable long career_id, Authentication authentication) throws AccessDeniedException{
        userService.setCareerPreference(career_id, authentication);
        HashMap<String, String> res = new HashMap<>();
        res.put("message", "Career set successfully");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/career/preference")
    public ResponseEntity<HashMap<String, Object>> getUserPreferenceCareerId(@RequestParam(required = false, defaultValue = "false") boolean includeSkills, Authentication authentication) throws AccessDeniedException{
        HashMap<String, Object> res = new HashMap<>();
        Career career = userService.getUserPreferenceCareer(authentication);
        if (includeSkills){
            List<CareerSkills> existingCareerSkillsIdList =  careerSkillAssociationService.findCareerSkillsByCareerId(career.getCareerId());
            res.put("skills", mappingUtils.mapCareerSkillsIntoSkillDTO(existingCareerSkillsIdList));
        }
        res.put("career", career);
        return ResponseEntity.ok(res);
    }
}
