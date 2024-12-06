package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSimilarityScoreDTO;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.repository.UserRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class QuestionaireService {
    private final CareerRecommendationService careerRecommendationService;
    private final UserRepository userRepository;

    @Autowired
    public QuestionaireService(CareerRecommendationService careerRecommendationService, UserRepository userRepository) {
        this.careerRecommendationService = careerRecommendationService;
        this.userRepository = userRepository;
    }

    public PageDTO<CareerWithSimilarityScoreDTO> getResult(List<CareerSkillDTO> userSkills, Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }

        // get userId
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();

        // save user skill into userSkillsTable

        // get recommendation
        return careerRecommendationService.getRecommendedCareers(0,10,userSkills);
    }
}
