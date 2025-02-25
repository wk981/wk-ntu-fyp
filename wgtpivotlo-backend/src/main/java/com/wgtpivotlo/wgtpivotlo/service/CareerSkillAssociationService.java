package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.mapper.MappingUtils;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.model.UserSkills;
import com.wgtpivotlo.wgtpivotlo.repository.CareerRepository;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CareerSkillAssociationService {
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final CareerRepository careerRepository;
    private final MappingUtils mappingUtils;

    @Autowired
    public CareerSkillAssociationService(CareerSkillAssociationRepository careerSkillAssociationRepository, CareerRepository careerRepository, MappingUtils mappingUtils) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.careerRepository = careerRepository;
        this.mappingUtils = mappingUtils;
    }

    // get career along with skills and profiency
    public Optional<CareerWithSkillsDTO> findByCareerId(Long career_id){
        Optional<Career> career = careerRepository.findById(career_id);
        List<CareerSkills> careerSkillsList = findCareerSkillsByCareerId(career_id);
        CareerWithSkillsDTO careerWithSkillsDTO = null;

        if(career.isPresent()){
            careerWithSkillsDTO = mappingUtils.mapSkillsIntoCareer(career.get(), careerSkillsList);
        }
        else{
            throw new ResourceNotFoundException("career id with " + career_id + " is not found in database");
        }
        return Optional.ofNullable(careerWithSkillsDTO);
    }

    // get all career that contains skillIdList and return career along with skills and profiency
    public List<CareerWithSkillsDTO> findAllCareerBySkillIdList(List<Long> skillIdList){
        List<Career> careerList = careerRepository.findCareerSkillsBySkillIds(skillIdList);
        List<CareerWithSkillsDTO> res = careerList.stream().map((career) ->{
            List<CareerSkills> careerSkillsList = findCareerSkillsByCareerId(career.getCareerId());
            return mappingUtils.mapSkillsIntoCareer(career, careerSkillsList);
        }).toList();
        return res;
    }

    public List<CareerSkills> findCareerSkillsByCareerId(Long careerId){
        Optional<List<CareerSkills>> existingCareerSkillsList = careerSkillAssociationRepository.findByCareerIdsNative(Collections.singletonList(careerId));
        existingCareerSkillsList.orElseThrow(() -> new ResourceNotFoundException("No skills found for that career"));
        return existingCareerSkillsList.get();
    }

}