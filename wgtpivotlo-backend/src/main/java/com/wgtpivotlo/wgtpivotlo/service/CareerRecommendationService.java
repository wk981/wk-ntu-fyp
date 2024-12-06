package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.mapper.MappingUtils;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class CareerRecommendationService {
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;

    @Autowired
    public CareerRecommendationService(CareerSkillAssociationRepository careerSkillAssociationRepository) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
    }

    public PageDTO<CareerWithSimilarityScoreDTO> getRecommendedCareers(int pageNumber, int pageSize, List<CareerSkillDTO> careerSkillDTOList){
        // Paging
        int correctedPageNumber = (pageNumber > 0) ? pageNumber - 1 : 0;
        Pageable pageable = PageRequest.of(correctedPageNumber, pageSize);

        // totalPage is n, pageNumber must be from 0 to n
        if (pageNumber < 0){
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        log.info("Step1a: Making a query to get careers with similarity score");
        // Get all the career related to skills and profiency along with similarity score.
        Page<Object[]> careersWithSimilairyScorePage = careerSkillAssociationRepository.findAllBySkillIdsAndProfiency(careerSkillDTOList, pageable);

        if (correctedPageNumber >= careersWithSimilairyScorePage.getTotalPages()) {
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        log.info("Step1b: Cleaning up data");
        List<Object[]> careersWithSimilarityScorePageList = careersWithSimilairyScorePage.getContent();
        List<CareerWithSimilarityScoreDTO> careerWithSimilarityScoreDTOList = careersWithSimilarityScorePageList
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

        return new PageDTO<>(careersWithSimilairyScorePage.getTotalPages(), pageNumber, careerWithSimilarityScoreDTOList);

    }

}
