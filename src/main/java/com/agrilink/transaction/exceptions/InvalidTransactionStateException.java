package com.agrilink.transaction.exceptions;

import com.agrilink.shared.exceptions.InvalidOperationException;

public class InvalidTransactionStateException extends InvalidOperationException {

    public InvalidTransactionStateException(String message) {
        super(message);
    }
}
