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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

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

    public List<CareerSkills> findCareerSkillsByCareerId(Long careerId){
        Optional<List<CareerSkills>> existingCareerSkillsList = careerSkillAssociationRepository.findByCareerIdsNative(Collections.singletonList(careerId));
        existingCareerSkillsList.orElseThrow(() -> new ResourceNotFoundException("No skills found for that career"));
        return existingCareerSkillsList.get();
    }

    public List<Long> findSkillIdsByCareerId(Long careerId){
        Optional<List<Long>> existingSkillIdList = careerSkillAssociationRepository.findSkillsIdByCareerId(careerId);
        existingSkillIdList.orElseThrow(() -> new ResourceNotFoundException("No skills found for that career"));
        return existingSkillIdList.get();
    }
}
