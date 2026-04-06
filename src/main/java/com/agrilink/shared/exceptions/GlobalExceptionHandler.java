package com.agrilink.shared.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // 404s
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404)
                .body(new ErrorResponse(404, ex.getMessage()));
    }

    // 409s
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleConflict(DuplicateResourceException ex) {
        return ResponseEntity.status(409)
                .body(new ErrorResponse(409, ex.getMessage()));
    }

    // 400s
    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(InvalidOperationException ex) {
        return ResponseEntity.status(400)
                .body(new ErrorResponse(400, ex.getMessage()));
    }

    // 403s
    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedActionException ex) {
        return ResponseEntity.status(403)
                .body(new ErrorResponse(403, ex.getMessage()));
    }

    // validation errors from @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        return ResponseEntity.status(400)
                .body(new ErrorResponse(400, message));
    }

    // safety net — catches anything else
    @ExceptionHandler(AgrilinkException.class)
    public ResponseEntity<ErrorResponse> handleGeneral(AgrilinkException ex) {
        return ResponseEntity.status(500)
                .body(new ErrorResponse(500, ex.getMessage()));
    }
}

