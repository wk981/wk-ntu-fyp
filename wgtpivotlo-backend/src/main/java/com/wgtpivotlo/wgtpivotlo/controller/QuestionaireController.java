package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSimilarityScoreDTO;
import com.wgtpivotlo.wgtpivotlo.dto.QuestionaireRequest;
import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.service.CareerService;
import com.wgtpivotlo.wgtpivotlo.service.FileService;
import com.wgtpivotlo.wgtpivotlo.service.QuestionaireService;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/questionaire")
public class QuestionaireController {
    private final QuestionaireService questionaireService;
    private final FileService fileService;
    private final CareerService careerService;

    @Autowired
    public QuestionaireController(QuestionaireService questionaireService, FileService fileService, CareerService careerService) {
        this.questionaireService = questionaireService;
        this.fileService = fileService;
        this.careerService = careerService;
    }

    @GetMapping("/sectors")
    public ResponseEntity<List<String>> getSectors(){
        return ResponseEntity.ok(careerService.getSectors());
    }

    @PostMapping("/result")
    public ResponseEntity<?> getResult(@RequestBody QuestionaireRequest questionaireRequest, Authentication authentication) throws AccessDeniedException {
        HashMap<String, List<CareerWithSimilarityScoreDTO>> res = questionaireService.getResult(questionaireRequest, authentication);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/upload")
    public ResponseEntity<Set<SkillDTO>> uploadFile (@RequestParam("file") MultipartFile file) throws IOException, InvalidFormatException {
        return ResponseEntity.ok(fileService.processFile(file));
    }
}
