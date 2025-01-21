package com.wgtpivotlo.wgtpivotlo.errors;

import com.wgtpivotlo.wgtpivotlo.errors.exceptions.PageItemsOutOfBoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.UserExists;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.BadRequestException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.nio.file.AccessDeniedException;

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

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Object> handleUsernameNotFoundException(HttpServletRequest req, UsernameNotFoundException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED)
                .message(ex.getMessage())
                .build();
        return buildResponseEntity(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleAccessDeniedException(HttpServletRequest req, BadCredentialsException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED)
                .message(ex.getMessage())
                .build();
        return buildResponseEntity(errorResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Object> handleAuthenticationException(HttpServletRequest req, AuthenticationException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED)
                .message("Authentication Failed")
                .build();
        return buildResponseEntity(errorResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(HttpServletRequest req, AccessDeniedException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED)
                .message("Access Denied")
                .build();
        return buildResponseEntity(errorResponse);
    }

    @ExceptionHandler(UserExists.class)
    public ResponseEntity<Object> handleUserExistsException(HttpServletRequest req, UserExists ex){
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.CONFLICT)
                .message(ex.getMessage())
                .build();
        return buildResponseEntity(errorResponse);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequestException(HttpServletRequest req, BadRequestException ex){
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(ex.getMessage())
                .build();
        return buildResponseEntity(errorResponse);
    }
}
