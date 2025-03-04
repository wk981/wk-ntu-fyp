package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.AddCareerRequest;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.UpdateCareerRequest;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.repository.CareerRepository;
import com.wgtpivotlo.wgtpivotlo.repository.criterias.CareerSpecification;
import jakarta.transaction.Transactional;
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
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Service
public class CareerService {
    private final CareerRepository careerRepository;

    @Autowired
    public CareerService(CareerRepository careerRepository) {
        this.careerRepository = careerRepository;
    }

    public List<String> getSectors(){
        return careerRepository.findAllSector();
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

    @Transactional
    public void updateCareer(UpdateCareerRequest request, MultipartFile thumbnail, long id) throws BadRequestException {
        if (request == null) {
            throw new BadRequestException("Bad Request");
        }

        Career career = getCareerById(id);

        // Update non-null fields and flag the update if a change is made.
        Optional.ofNullable(request.getTitle()).ifPresent(career::setTitle);
        Optional.ofNullable(request.getCareerLevel()).ifPresent(career::setCareerLevel);
        Optional.ofNullable(request.getResponsibility()).ifPresent(career::setResponsibility);

        if (request.getSector() != null && checkValidSector(request.getSector())) {
            career.setSector(request.getSector());
        }

//        if (thumbnail != null && !thumbnail.isEmpty()) {
//            // Upload image to S3 and then set the image URL
////            String imageUrl = s3Service.upload(thumbnail); // Assuming you have s3Service for upload
////            career.setImageUrl(imageUrl);
////            updated.set(true);
//        }

        // Update the modification date only if any field was updated.
        career.setUpdated_on(LocalDateTime.now());

        log.info("Career Updated");
        careerRepository.save(career);
    }

    @Transactional
    public void addCareer(AddCareerRequest request, MultipartFile thumbnail) throws BadRequestException {
        if (request == null){
            throw new BadRequestException("Bad Request");
        }
        Career career = new Career();
        Optional.ofNullable(request.getTitle()).ifPresent(career::setTitle);
        Optional.ofNullable(request.getCareerLevel()).ifPresent(career::setCareerLevel);
        Optional.ofNullable(request.getResponsibility()).ifPresent(career::setResponsibility);

        if(request.getSector() != null && checkValidSector(request.getSector())){
            career.setSector(request.getSector());
        }

        career.setUpdated_on(LocalDateTime.now());
        career.setCreated_on(LocalDateTime.now());
        log.info("Career Added");
        careerRepository.save(career);
    }

    @Transactional
    public void deleteCareerId(long id){
        Career career = getCareerById(id);

        log.info("Career Deleted");
        careerRepository.delete(career);
    }

    public Career getCareerById(long id){
        Optional<Career> career = careerRepository.findById(id);
        career.orElseThrow(() -> new ResourceNotFoundException("Career does not exist"));
        return career.get();
    }

    private boolean checkValidSector(String sector) throws BadRequestException {
        List<String> sectorList = getSectors();
        if(!sectorList.contains(sector)){
            throw new BadRequestException("No such sector: " + sector + ". Please contact database administrator to update sector constraint if needed");
        }
        return true;
    }
}
