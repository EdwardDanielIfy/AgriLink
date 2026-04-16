package com.agrilink.payment.exceptions;

import com.agrilink.shared.exceptions.AgrilinkException;

public class PaymentException extends AgrilinkException {

    public PaymentException(String message) {
        super(message);
    }
}