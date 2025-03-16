package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CareerSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSkillsDTO;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.DuplicateException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.mapper.MappingUtils;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.model.CourseSkills;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.repository.CareerRepository;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import com.wgtpivotlo.wgtpivotlo.repository.SkillRepository;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CareerSkillAssociationService {
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final CareerRepository careerRepository;
    private final SkillRepository skillRepository;
    private final MappingUtils mappingUtils;

    @Autowired
    public CareerSkillAssociationService(CareerSkillAssociationRepository careerSkillAssociationRepository, CareerRepository careerRepository, SkillRepository skillRepository, MappingUtils mappingUtils) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.careerRepository = careerRepository;
        this.skillRepository = skillRepository;
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

    @Transactional
    public void addCareerSkill(CareerSkillsDTO careerSkillsDTO) throws BadRequestException {
        if (careerSkillsDTO == null) {
            throw new BadRequestException("Bad request");
        }
        Optional<CareerSkills> existingCareerSkills = careerSkillAssociationRepository.findCareerSkillsByCareerIdAndSkillId(careerSkillsDTO.getCareerId(), careerSkillsDTO.getSkillId());
        if(existingCareerSkills.isPresent()){
            throw new DuplicateException("Skill is already associated with Career");
        }
        CareerSkills newCareerSkills = new CareerSkills();
        Career career = careerRepository.findById(careerSkillsDTO.getCareerId()).orElseThrow(() -> new ResourceNotFoundException("Career not found"));
        Skill skill = skillRepository.findById(careerSkillsDTO.getSkillId()).orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        newCareerSkills.setCareer(career);
        newCareerSkills.setSkill(skill);
        newCareerSkills.setProfiency(careerSkillsDTO.getProfiency());

        careerSkillAssociationRepository.save(newCareerSkills);
    }

    @Transactional
    public void editCareerSkill(CareerSkillsDTO careerSkillsDTO) throws BadRequestException {
        if (careerSkillsDTO == null) {
            throw new BadRequestException("Invalid request: CareerSkillsDTO cannot be null");
        }

        // Fetch the existing Career-Skill association
        CareerSkills existingCareerSkills = careerSkillAssociationRepository
                .findCareerSkillsByCareerIdAndSkillId(careerSkillsDTO.getCareerId(), careerSkillsDTO.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Career-Skill not found"));

        // Ensure the career matches
        if (!careerSkillsDTO.getCareerId().equals(existingCareerSkills.getCareer().getCareerId())) {
            throw new BadRequestException("Career does not match");
        }

        boolean isUpdated = false;

        // Update Proficiency if needed
        if (careerSkillsDTO.getProfiency() != null &&
                !careerSkillsDTO.getProfiency().equals(existingCareerSkills.getProfiency())) {
            existingCareerSkills.setProfiency(careerSkillsDTO.getProfiency());
            isUpdated = true;
        }

        // Save only if changes were made
        if (isUpdated) {
            careerSkillAssociationRepository.save(existingCareerSkills);
        }
    }

    @Transactional
    public void deleteCareerSkill(CareerSkillsDTO careerSkillsDTO) throws BadRequestException {
        if (careerSkillsDTO == null || careerSkillsDTO.getCareerId() == null || careerSkillsDTO.getSkillId() == null) {
            throw new BadRequestException("Invalid request: Career ID and Skill ID must be provided");
        }

        // Find the existing Career-Skill association
        CareerSkills existingCareerSkills = careerSkillAssociationRepository
                .findCareerSkillsByCareerIdAndSkillId(careerSkillsDTO.getCareerId(), careerSkillsDTO.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Career-Skill association not found"));

        // Delete and flush immediately
        careerSkillAssociationRepository.delete(existingCareerSkills);
        careerSkillAssociationRepository.flush();
    }
}