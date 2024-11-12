package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.mapper.PageMapper;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.repository.SkillRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SkillService {
    private final SkillRepository skillRepository;
    private final PageMapper<Skill> pageMapper;

    @Autowired
    public SkillService(SkillRepository skillRepository, PageMapper<Skill> pageMapper) {
        this.skillRepository = skillRepository;
        this.pageMapper = pageMapper;
    }


    public List<Skill> findAll(){
        List<Skill> skillsList = skillRepository.findAll();
        log.info("Fetching all of the skills");
        log.info(skillsList.toString());
        if (skillsList.isEmpty()){
            log.warn("No skills found in the database");
            throw new ResourceNotFoundException("No skill found in the database");
        }
        return skillsList;
    }

    public Map<String, Object> findAllPagination(int pageNumber, int pageSize){
        Map<String, Object> res = new HashMap<String, Object>();
        int correctedPageNumber = (pageNumber > 0) ? pageNumber - 1 : 0;
        Pageable skillPageWithElements = PageRequest.of(correctedPageNumber, pageSize);

        log.info("Step1a: Making a query to get skills");
        Page<Skill> paginatedSkills = skillRepository.findAll(skillPageWithElements);
        if (correctedPageNumber >= paginatedSkills.getTotalPages()) {
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        log.info("Step1b: Creating skillDTO");
        List<SkillDTO> skillDTOList= paginatedSkills.getContent().stream().map(SkillDTO::new).collect(Collectors.toList());;

        log.info("Step2: Tidying up body and pagination");
        PageDTO pageDTO = pageMapper.PageableToPageDTO(paginatedSkills);

        res.put("totalPages", pageDTO.getPages());
        res.put("pageNumber", pageNumber);
        res.put("content", skillDTOList);
        return res;
    }

    public Optional<Skill> findId(long id) {
        Optional<Skill> skill = skillRepository.findById(id);
        if (skill.isEmpty()){
            throw new ResourceNotFoundException("skill id with " + id + " is not found in database");
        }
        else{
            return skill;
        }
    }
}
