package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.SkillIdWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSimilarityScoreDTO;
import com.wgtpivotlo.wgtpivotlo.dto.QuestionaireRequest;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.UserSkills;
import com.wgtpivotlo.wgtpivotlo.repository.CareerRepository;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserSkillsRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class QuestionaireService {
    private final CareerRecommendationService careerRecommendationService;
    private final UserSkillsRepository userSkillsRepository;
    private final CareerRepository careerRepository;

    @Autowired
    public QuestionaireService(CareerRecommendationService careerRecommendationService, UserSkillsRepository userSkillsRepository, CareerRepository careerRepository) {
        this.careerRecommendationService = careerRecommendationService;
        this.userSkillsRepository = userSkillsRepository;
        this.careerRepository = careerRepository;
    }

    @Transactional
    public HashMap<String, List<CareerWithSimilarityScoreDTO>> getResult(QuestionaireRequest questionaireRequest, Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }

        List<SkillIdWithProfiencyDTO> userSkills = questionaireRequest.getSkillIdWithProfiencyDTOList();

        // get userId
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();

        // save user skill into userSkillsTable
        Optional<List<UserSkills>> existingUserSkills = userSkillsRepository.findByUserId(userId);
        if (existingUserSkills.isPresent()){
            // remove and overwrite
            log.info("Removing user skills");
            userSkillsRepository.deleteByUserId(userId);
        }

        // insert or overwrite
        for(SkillIdWithProfiencyDTO userSkill: userSkills){
            userSkillsRepository.insertByUserIdAndSkillIdAndProfiency(userId, userSkill.getSkillId(), userSkill.getProfiency().toString());
        }

        return careerRecommendationService.getQuestionaireRecommendation(userSkills, questionaireRequest.getCareerLevel(),  PageRequest.of(0, 5), Optional.ofNullable(questionaireRequest.getSector()));
    }

}
