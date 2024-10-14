package com.wgtpivotlo.wgtpivotlo.errors;

import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class GlobalDefaultExceptionHandler extends ResponseEntityExceptionHandler {

    // Build error response
    private ResponseEntity<Object> buildResponseEntity(ErrorResponse errorResponse){
        return new ResponseEntity<Object>(errorResponse, errorResponse.getStatus());
    }

    // No resource
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleEmptyResultDataAccessException(HttpServletRequest req, ResourceNotFoundException ex){
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND)
                .message(ex.getMessage())
                .build();
        return buildResponseEntity(errorResponse);
    }
}
