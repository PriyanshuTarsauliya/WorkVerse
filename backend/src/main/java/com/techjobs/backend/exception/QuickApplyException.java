package com.techjobs.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class QuickApplyException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;
    private final List<String> missingFields;

    public QuickApplyException(HttpStatus status, String errorCode, String message) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.missingFields = List.of();
    }

    public QuickApplyException(HttpStatus status, String errorCode, String message, List<String> missingFields) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.missingFields = missingFields;
    }
}
