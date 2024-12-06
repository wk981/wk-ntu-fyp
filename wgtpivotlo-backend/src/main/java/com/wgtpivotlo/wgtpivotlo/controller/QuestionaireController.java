package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSimilarityScoreDTO;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.QuestionaireRequest;
import com.wgtpivotlo.wgtpivotlo.service.QuestionaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/v1/questionaire")
public class QuestionaireController {
    private final QuestionaireService questionaireService;

    @Autowired
    public QuestionaireController(QuestionaireService questionaireService) {
        this.questionaireService = questionaireService;
    }

    @PostMapping("/result")
    public ResponseEntity<PageDTO<CareerWithSimilarityScoreDTO>> getResult(@RequestBody QuestionaireRequest questionaireRequest, Authentication authentication) throws AccessDeniedException {
        return ResponseEntity.ok(questionaireService.getResult(questionaireRequest.getCareerSkillDTOList(), authentication));
    }
}
