package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.CareerLevel;
import com.wgtpivotlo.wgtpivotlo.enums.Choice;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import com.wgtpivotlo.wgtpivotlo.repository.criteria.CareerSkillAssociationRepositoryImpl;
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
    public CareerRecommendationService(CareerSkillAssociationRepository careerSkillAssociationRepository, CareerSkillAssociationRepositoryImpl careerSkillAssociationRepositoryImpl) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
    }

    private Optional<Page<Object[]>> recommendCareerSwitch(List<CareerSkillDTO> careerSkillDTOList, CareerLevel careerLevel, Pageable pageable, Optional<String> sector, Choice choice){
        return switch (choice){
            case ASPIRATION -> careerSkillAssociationRepository.findAspirational(careerSkillDTOList, careerLevel,pageable,sector);
            case DIRECT_MATCH -> careerSkillAssociationRepository.findDirectMatches(careerSkillDTOList, careerLevel,pageable,sector);
            case PATHWAY -> careerSkillAssociationRepository.findPathways(careerSkillDTOList, careerLevel,pageable,sector);
        };
    }

    public PageDTO<CareerWithSimilarityScoreDTO> getRecommendedCareers(int pageNumber, int pageSize, List<CareerSkillDTO> careerSkillDTOList, String sector, CareerLevel careerLevel, Choice choice){
        // Paging
        int correctedPageNumber = (pageNumber > 0) ? pageNumber - 1 : 0;

        // totalPage is n, pageNumber must be from 0 to n
        if (pageNumber < 0){
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        Pageable pageable = PageRequest.of(correctedPageNumber, pageSize);

        log.info("Step1a: Making a query to get careers with similarity score");
        // Get all the career related to skills and profiency along with similarity score.
        Optional<Page<Object[]>> careersWithSimilairyScorePage = recommendCareerSwitch(careerSkillDTOList, careerLevel, pageable, Optional.empty(), choice);

        if (careersWithSimilairyScorePage.isEmpty()){
            log.warn("No career returned");
            throw new ResourceNotFoundException("No career found");
        }

        if (correctedPageNumber >= careersWithSimilairyScorePage.get().getTotalPages()) {
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        log.info("Step1b: Cleaning up data");
        List<Object[]> careersWithSimilarityScorePageList = careersWithSimilairyScorePage.get().getContent();
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

        return new PageDTO<>(careersWithSimilairyScorePage.get().getTotalPages(), pageNumber, careerWithSimilarityScoreDTOList);

    }


}
