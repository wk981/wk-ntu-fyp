package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.CareerWithSkillDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillWithProfiencyDTO;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.CareerSkills;
import com.wgtpivotlo.wgtpivotlo.repository.CareerRepository;
import com.wgtpivotlo.wgtpivotlo.repository.CareerSkillAssociationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CareerSkillAssociationService {
    private final CareerSkillAssociationRepository careerSkillAssociationRepository;
    private final CareerRepository careerRepository;

    @Autowired
    public CareerSkillAssociationService(CareerSkillAssociationRepository careerSkillAssociationRepository, CareerRepository careerRepository) {
        this.careerSkillAssociationRepository = careerSkillAssociationRepository;
        this.careerRepository = careerRepository;
    }

    public Optional<CareerWithSkillDTO> findByCareerId(Long career_id){
        Optional<Career> career = careerRepository.findById(career_id);
        Optional<List<CareerSkills>> careerSkillsList = careerSkillAssociationRepository.findByCareer(career);
        CareerWithSkillDTO careerWithSkillDTO = null;

        if(careerSkillsList.isPresent() && career.isPresent()){
            List<SkillWithProfiencyDTO> careerSkillWithProficiencyDTOList = new ArrayList<>();;
            for (CareerSkills careerSkills: careerSkillsList.get()){
                SkillWithProfiencyDTO skillWithProfiencyDTO
                        = SkillWithProfiencyDTO
                        .builder()
                        .skillId(careerSkills.getSkill().getSkillId())
                        .name(careerSkills.getSkill().getName())
                        .description(careerSkills.getSkill().getDescription())
                        .pic(careerSkills.getSkill().getPic_url())
                        .profiency(careerSkills.getProfiency())
                        .build();
                careerSkillWithProficiencyDTOList.add(skillWithProfiencyDTO);
            }
            careerWithSkillDTO = CareerWithSkillDTO
                    .builder()
                    .skillsWithProfiency(careerSkillWithProficiencyDTOList)
                    .career_id(career.get().getCareerId())
                    .title(career.get().getTitle())
                    .sector(career.get().getSector())
                    .responsibility(career.get().getResponsibility())
                    .careerLevel(career.get().getCareerLevel())
                    .pic_url(career.get().getPic_url())
                    .build();
        }
        else{
            throw new ResourceNotFoundException("career id with " + career_id + " is not found in database");
        }

        return Optional.ofNullable(careerWithSkillDTO);
    }
}
