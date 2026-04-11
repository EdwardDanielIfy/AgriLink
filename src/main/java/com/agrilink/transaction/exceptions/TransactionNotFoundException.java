package com.agrilink.transaction.exceptions;

import com.agrilink.shared.exceptions.ResourceNotFoundException;

public class TransactionNotFoundException extends ResourceNotFoundException {

    public TransactionNotFoundException(String transactionId) {
        super("Transaction with id: " + transactionId + " not found");
    }
}
