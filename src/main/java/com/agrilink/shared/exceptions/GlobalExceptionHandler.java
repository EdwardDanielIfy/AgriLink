package com.agrilink.shared.exceptions;

import com.agrilink.shared.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // 404s
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponse> handleNotFound(ResourceNotFoundException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.NOT_FOUND);
    }
    // 409s
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<APIResponse> handleConflict(DuplicateResourceException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.CONFLICT);
    }

    // 400s
    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<APIResponse> handleBadRequest(InvalidOperationException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    // 403s
    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<APIResponse> handleUnauthorized(UnauthorizedActionException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.FORBIDDEN);
    }

    // validation errors from @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        return new ResponseEntity<>(new APIResponse(false, message), HttpStatus.BAD_REQUEST);
    }

    // safety net — catches anything else
    @ExceptionHandler(AgrilinkException.class)
    public ResponseEntity<APIResponse> handleGeneral(AgrilinkException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

