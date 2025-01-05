package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillDTO;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionaireService {
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final UserSkillsRepository userSkillsRepository;
    private final CareerRepository careerRepository;

    @Autowired
    public QuestionaireService(CareerSkillAssociationRepository careerSkillAssociationRepository, UserSkillsRepository userSkillsRepository, CareerRepository careerRepository) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.userSkillsRepository = userSkillsRepository;
        this.careerRepository = careerRepository;
    }

    public List<String> getSectors(){
        return careerRepository.findAllCareer();
    }

    @Transactional
    public HashMap<String, List<CareerWithSimilarityScoreDTO>> getResult(QuestionaireRequest questionaireRequest, Authentication authentication) throws AccessDeniedException {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }

        List<CareerSkillDTO> userSkills = questionaireRequest.getCareerSkillDTOList();

        // get userId
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();

        // save user skill into userSkillsTable
        Optional<List<UserSkills>> existingUserSkills = userSkillsRepository.findByUserId(userId);
        if (existingUserSkills.isPresent()){
            // remove and overwrite
            userSkillsRepository.deleteByUserId(userId);
        }

        // insert or overwrite
        for(CareerSkillDTO userSkill: userSkills){
            userSkillsRepository.insertByUserIdAndSkillIdAndProfiency(userId, userSkill.getSkillId(), userSkill.getProfiency().toString());
        }

        Optional<HashMap<String, List<Object[]>>> mixedCareersResult= careerSkillAssociationRepository.recommend(userSkills,questionaireRequest.getCareerLevel(), PageRequest.of(0, 5), Optional.ofNullable(questionaireRequest.getSector()));

        mixedCareersResult.orElseThrow(() -> new ResourceNotFoundException("No career found"));
        HashMap<String, List<Object[]>> mixedCareers = mixedCareersResult.get();

        HashMap<String, List<CareerWithSimilarityScoreDTO>> res = new HashMap<>();

        for (HashMap.Entry<String, List<Object[]>> entry : mixedCareers.entrySet()) {
            String key = entry.getKey();
            List<Object[]> temp = entry.getValue();

            List<CareerWithSimilarityScoreDTO> tempCareerWithSimilarityScore = temp
                    .stream()
                    .map((Object[] objects)-> {
                        Career career = (Career) objects[0];
                        Double similarityScore = (Double) objects[1];
                        return CareerWithSimilarityScoreDTO
                                .builder()
                                .career(career)
                                .similarityScore(String.format("%.2f", similarityScore))
                                .build();
                    }
            ).toList();

            res.put(key, tempCareerWithSimilarityScore);
        }
        return res;
    }

}
