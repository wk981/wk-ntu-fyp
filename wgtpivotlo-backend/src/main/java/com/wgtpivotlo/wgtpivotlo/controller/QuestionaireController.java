package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.QuestionaireRequest;
import com.wgtpivotlo.wgtpivotlo.service.QuestionaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/questionaire")
public class QuestionaireController {
    private final QuestionaireService questionaireService;

    @Autowired
    public QuestionaireController(QuestionaireService questionaireService) {
        this.questionaireService = questionaireService;
    }

    @GetMapping("/sectors")
    public ResponseEntity<List<String>> getSectors(){
        return ResponseEntity.ok(questionaireService.getSectors());
    }

    @PostMapping("/result")
    public ResponseEntity<?> getResult(@RequestBody QuestionaireRequest questionaireRequest, Authentication authentication) throws AccessDeniedException {
        HashMap<String, List<Object[]>> res = questionaireService.getResult(questionaireRequest, authentication);
        return ResponseEntity.ok(res);
    }
}
