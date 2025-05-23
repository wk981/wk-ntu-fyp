package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.AddSkillRequest;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.dto.UpdateSkillRequest;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.repository.SkillRepository;
import com.wgtpivotlo.wgtpivotlo.repository.criterias.CareerSpecification;
import com.wgtpivotlo.wgtpivotlo.repository.criterias.SkillSpecification;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SkillService {
    private final SkillRepository skillRepository;

    @Autowired
    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }


    public List<Skill> findAll(){
        List<Skill> skillsList = skillRepository.findAll();
        log.info("Fetching all of the skills");
        if (skillsList.isEmpty()){
            log.warn("No skills found in the database");
            throw new ResourceNotFoundException("No skill found in the database");
        }
        return skillsList;
    }

    public PageDTO<SkillDTO> findAllPagination(int pageNumber, int pageSize, Optional<String> name){
        int correctedPageNumber = (pageNumber > 0) ? pageNumber - 1 : 0;
        Pageable pageable = PageRequest.of(correctedPageNumber, pageSize);


        log.info("Step1a: Making a query to get skills");
        Specification<Skill> specification = SkillSpecification.getSpecification(name);
        Page<Skill> skills = skillRepository.findAll(specification, pageable);


        if (correctedPageNumber >= skills.getTotalPages()) {
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }


        log.info("Step1b: Creating skillDTO");
        List<SkillDTO> skillDTOList= skills.getContent().stream().map(SkillDTO::new).collect(Collectors.toList());;

        log.info("Step2: Tidying up body and pagination");
        return new PageDTO<>(skills.getTotalPages(), pageNumber, skillDTOList);
    }

    public Skill findId(long id) {
        Optional<Skill> skill = skillRepository.findById(id);
        if (skill.isEmpty()){
            throw new ResourceNotFoundException("skill id with " + id + " is not found in database");
        }
        else{
            return skill.get();
        }
    }

    public List<Skill> findSkill(String q){
        return skillRepository.findByNameContainingIgnoreCase(q.toLowerCase());
    }

    @Transactional
    public void createSkill(@Valid AddSkillRequest request, MultipartFile thumbnail) throws BadRequestException {
        if (request == null) {
            throw new BadRequestException("Bad Request");
        }
        Skill skill = new Skill();
        Optional.ofNullable(request.getName()).ifPresent(skill::setName);
        Optional.ofNullable(request.getDescription()).ifPresent(skill::setDescription);

        skill.setUpdated_on(LocalDateTime.now());
        skill.setCreated_on(LocalDateTime.now());
        log.info("Career Added");
        skillRepository.save(skill);

    }

    @Transactional
    public void updateSkill(UpdateSkillRequest request, MultipartFile thumbnail, long id) throws BadRequestException {
        if (request == null) {
            throw new BadRequestException("Bad Request");
        }
        Skill skill = findId(id);

        Optional.ofNullable(request.getName()).ifPresent(skill::setName);
        Optional.ofNullable(request.getDescription()).ifPresent(skill::setDescription);

        skill.setUpdated_on(LocalDateTime.now());
        skillRepository.save(skill);
    }

    @Transactional
    public void deleteCareerId(long id) {
        Skill skill = findId(id);

        log.info("Skill deleted");
        skillRepository.delete(skill);
    }
}
