package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.repository.CareerRepository;
import com.wgtpivotlo.wgtpivotlo.repository.criterias.CareerSpecification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class CareerService {
    private final CareerRepository careerRepository;

    @Autowired
    public CareerService(CareerRepository careerRepository) {
        this.careerRepository = careerRepository;
    }

    public List<String> getSectors(){
        return careerRepository.findAllCareer();
    }

    public PageDTO<Career> findAllPaginationCareer(int pageNumber, int pageSize, Optional<String> title, Optional<String> sector, Optional<String> careerLevel){
        int correctedPageNumber = (pageNumber > 0) ? pageNumber - 1 : 0;
        Pageable pageable = PageRequest.of(correctedPageNumber, pageSize);
        Specification<Career> specification = CareerSpecification.getSpecification(title, sector, careerLevel);
        Page<Career> careers = careerRepository.findAll(specification,pageable);

        if (correctedPageNumber >= careers.getTotalPages()) {
            log.warn("Page number out of bounds");
            throw new PageItemsOutOfBoundException("Page number out of bounds");
        }

        return new PageDTO<>(careers.getTotalPages(), pageNumber, careers.getContent());
    }

}
