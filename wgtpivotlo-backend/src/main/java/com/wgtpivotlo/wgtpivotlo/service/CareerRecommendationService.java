package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.*;
import com.wgtpivotlo.wgtpivotlo.enums.SkillLevel;
import com.wgtpivotlo.wgtpivotlo.mapper.CareerWithSkillMapper;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<Object> getRecommendedCareers(){
        CareerSkillDTO skillProfiencyData1 = new CareerSkillDTO(4L, SkillLevel.Advanced);
        CareerSkillDTO skillProfiencyData2 = new CareerSkillDTO(2L, SkillLevel.Advanced);
        CareerSkillDTO skillProfiencyData3 = new CareerSkillDTO(10L, SkillLevel.Advanced);

        List<CareerSkillDTO> skillsProfiencyList = new ArrayList<>();
        skillsProfiencyList.add(skillProfiencyData1);
        skillsProfiencyList.add(skillProfiencyData2);
        skillsProfiencyList.add(skillProfiencyData3);

        // Get all the career related to skills and profiency
        // TODO: Return a Page<Career> instead of CareerSkills. Then we fetch careerSkillsList using careerSkillAssociationRepository.findByCareerIdsNative
        List<Object> filteredCareers = careerSkillAssociationRepository.findAllBySkillIdsAndProfiency(skillsProfiencyList);
        return filteredCareers;
//        // Career Set
//        Set<Career> careerSet = filteredCareers.stream().map(CareerSkills::getCareer).collect(Collectors.toSet());
//        List<Long> careerIdList = filteredCareers.stream().map((careerSkills -> careerSkills.getCareer().getCareer_id())).toList();
//
//        List<CareerSkills> careerSkillsList = careerSkillAssociationRepository.findByCareerIdsNative(careerIdList);
//        Map<Long, List<CareerSkills>> careerSkillsMap = careerSkillsList.stream().collect(Collectors.groupingBy(careerSkills -> careerSkills.getCareer().getCareer_id()));
//
//        List<CareerWithSimilarityScoreDTO> res = new ArrayList<>();
//        // map to CareerSkillWithProfiencyDTO
//        if (!careerSkillsList.isEmpty()){
//            for(Career career: careerSet){
//                long careerId = career.getCareer_id();
//                List<CareerSkills> currentCareerSkills = careerSkillsMap.getOrDefault(careerId, List.of());
//                CareerWithSkillDTO careerWithSkillDTO = careerWithSkillMapper.mapSkillsIntoCareer(career, currentCareerSkills);
//                double similarityScore = calculateCareerSimilarityScore(careerWithSkillDTO, skillsProfiencyList);
//                res.add(CareerWithSimilarityScoreDTO.builder().career(career).similarityScore(similarityScore).build());
//            }
//        }
//        return res;
    }

    private double calculateCareerSimilarityScore(CareerWithSkillDTO careerWithSkillDTO, List<CareerSkillDTO> userSkillsProfiencyList){
        List<SkillWithProfiencyDTO> skillWithProfiencyDTOList = careerWithSkillDTO.getSkillsWithProfiency();
        Set<Long> careerSkillSet = skillWithProfiencyDTOList
                .stream()
                .map((SkillDTO::getSkillId))
                .collect(Collectors.toSet());

        Set<Long> userSkillSet = userSkillsProfiencyList
                .stream()
                .map((CareerSkillDTO::getSkillId))
                .collect(Collectors.toSet());;

        // intersection
        Set<Long> intersection = new HashSet<>(userSkillSet);
        intersection.retainAll(careerSkillSet);

        // Calculate union
        Set<Long> union = new HashSet<>(userSkillSet);
        union.addAll(careerSkillSet);
        return (double) intersection.size() / union.size();
    }
}
