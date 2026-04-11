package com.agrilink.buyer.exceptions;

import com.agrilink.shared.exceptions.DuplicateResourceException;

public class DuplicateBuyerPhoneException extends DuplicateResourceException {

    public DuplicateBuyerPhoneException(String phone) {
        super("A buyer with phone number " + phone + " already exists");
    }
}