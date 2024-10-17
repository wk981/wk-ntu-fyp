package com.wgtpivotlo.wgtpivotlo.errors;

import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalDefaultExceptionHandler extends ResponseEntityExceptionHandler {

    // Build error response
    private ResponseEntity<Object> buildResponseEntity(ErrorResponse errorResponse){
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<Object>(errorResponse,headers, errorResponse.getStatus());
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

    @ExceptionHandler(PageItemsOutOfBoundException.class)
    public ResponseEntity<Object> handlePageItemsOutOfBoundException(HttpServletRequest req, PageItemsOutOfBoundException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(ex.getMessage())
                .build();
        return buildResponseEntity(errorResponse);
    }

}
