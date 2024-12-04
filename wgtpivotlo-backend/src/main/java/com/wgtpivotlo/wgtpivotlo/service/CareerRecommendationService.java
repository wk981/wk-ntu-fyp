package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.mapper.CareerWithSkillMapper;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CareerRecommendationService {
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final CareerWithSkillMapper careerWithSkillMapper;

    @Autowired
    public CareerRecommendationService(CareerSkillAssociationRepository careerSkillAssociationRepository, CareerWithSkillMapper careerWithSkillMapper) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.careerWithSkillMapper = careerWithSkillMapper;
    }

    public Page<Object> getRecommendedCareers(){
        // mock datas
        CareerSkillDTO skillProfiencyData1 = new CareerSkillDTO(4L, SkillLevel.Advanced);
        CareerSkillDTO skillProfiencyData2 = new CareerSkillDTO(2L, SkillLevel.Advanced);
        CareerSkillDTO skillProfiencyData3 = new CareerSkillDTO(10L, SkillLevel.Advanced);

        List<CareerSkillDTO> skillsProfiencyList = new ArrayList<>();
        skillsProfiencyList.add(skillProfiencyData1);
        skillsProfiencyList.add(skillProfiencyData2);
        skillsProfiencyList.add(skillProfiencyData3);

        // Paging
        Pageable pageable = PageRequest.of(14,10);

        // Get all the career related to skills and profiency along with similarity score.
        Page<Object> careersWithSimilairtyScorePage = careerSkillAssociationRepository.findAllBySkillIdsAndProfiency(skillsProfiencyList, pageable);

        return careersWithSimilairtyScorePage;

    }

}
