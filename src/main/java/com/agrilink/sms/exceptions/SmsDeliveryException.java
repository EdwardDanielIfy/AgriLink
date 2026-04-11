package com.agrilink.sms.exceptions;

import com.agrilink.shared.exceptions.AgrilinkException;

public class SmsDeliveryException extends AgrilinkException {

    public SmsDeliveryException(String phoneNumber) {
        super("Failed to deliver SMS to: " + phoneNumber);
    }
}