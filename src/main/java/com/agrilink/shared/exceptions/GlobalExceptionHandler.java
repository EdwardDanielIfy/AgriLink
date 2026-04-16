package com.agrilink.shared.exceptions;

import com.agrilink.agent.exceptions.AgentNotFoundException;
import com.agrilink.agent.exceptions.DuplicateAgentPhoneException;
import com.agrilink.buyer.exceptions.BuyerNotFoundException;
import com.agrilink.buyer.exceptions.DuplicateBuyerPhoneException;
import com.agrilink.farmer.exceptions.DuplicateFarmerPhoneException;
import com.agrilink.farmer.exceptions.FarmerNotFoundException;
import com.agrilink.produce.exceptions.ProduceNotAvailableException;
import com.agrilink.produce.exceptions.ProduceNotFoundException;
import com.agrilink.shared.APIResponse;
import com.agrilink.storage.exceptions.InsufficientStorageSlotsException;
import com.agrilink.storage.exceptions.StorageNotFoundException;
import com.agrilink.transaction.exceptions.InvalidTransactionStateException;
import com.agrilink.transaction.exceptions.TransactionNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            FarmerNotFoundException.class,
            AgentNotFoundException.class,
            BuyerNotFoundException.class,
            ProduceNotFoundException.class,
            StorageNotFoundException.class,
            TransactionNotFoundException.class
    })
    public ResponseEntity<APIResponse> handleNotFound(AgrilinkException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({
            DuplicateFarmerPhoneException.class,
            DuplicateAgentPhoneException.class,
            DuplicateBuyerPhoneException.class,
            InsufficientStorageSlotsException.class
    })
    public ResponseEntity<APIResponse> handleConflict(AgrilinkException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler({
            InvalidOperationException.class,
            InvalidTransactionStateException.class,
            ProduceNotAvailableException.class
    })
    public ResponseEntity<APIResponse> handleBadRequest(AgrilinkException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<APIResponse> handleUnauthorized(AgrilinkException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.FORBIDDEN);
    }

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

    @ExceptionHandler(AgrilinkException.class)
    public ResponseEntity<APIResponse> handleGeneral(AgrilinkException ex) {
        return new ResponseEntity<>(new APIResponse(false, ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}