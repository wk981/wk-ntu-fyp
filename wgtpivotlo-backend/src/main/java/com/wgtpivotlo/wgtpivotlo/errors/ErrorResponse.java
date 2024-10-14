package com.wgtpivotlo.wgtpivotlo.errors;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class ErrorResponse {
    private HttpStatus status;
    private LocalDateTime timeStamp;
    private String message;
}
