package com.wgtpivotlo.wgtpivotlo.controller;

import com.wgtpivotlo.wgtpivotlo.dto.AddCareerRequest;
import com.wgtpivotlo.wgtpivotlo.dto.MessageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.PageDTO;
import com.wgtpivotlo.wgtpivotlo.dto.UpdateCareerRequest;
import com.wgtpivotlo.wgtpivotlo.model.Career;
import com.wgtpivotlo.wgtpivotlo.service.CareerService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/career")
public class CareerController {
    private final CareerService careerService;

    @Autowired
    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @GetMapping
    public ResponseEntity<PageDTO<Career>> getAllCareer(
            @RequestParam(defaultValue = "1") @Min(1) int pageNumber,
            @RequestParam(defaultValue = "10") @Min(1) int pageSize,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String careerLevel,
            @RequestParam(required = false) String skillFilters){
        // skillFilters format: skillFilters=5:Advanced,6:Intermediate or skillFilters=5: ,6:Intermediate
        return ResponseEntity.ok(
                careerService
                        .findAllPaginationCareer(
                                pageNumber,
                                pageSize,
                                title,
                                sector,
                                careerLevel,
                                skillFilters
                        )
                );
    }

    @PostMapping("/")
    public ResponseEntity<MessageDTO> addCareer(@RequestPart("careerBody") @Valid AddCareerRequest request, @RequestPart("thumbnail") MultipartFile thumbnail) throws BadRequestException {
        careerService.addCareer(request,thumbnail);
        MessageDTO msg = MessageDTO.builder().message("Success").build();
        return ResponseEntity.status(HttpStatus.CREATED).body(msg);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageDTO> updateCareer(@RequestPart("careerBody") UpdateCareerRequest request, @RequestPart("thumbnail") MultipartFile thumbnail, @PathVariable long id) throws BadRequestException {
        careerService.updateCareer(request,thumbnail, id);
        MessageDTO msg = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(msg);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageDTO> deleteCareer(@PathVariable long id){
        careerService.deleteCareerId(id);
        MessageDTO msg = MessageDTO.builder().message("Success").build();
        return ResponseEntity.ok(msg);
    }

}
