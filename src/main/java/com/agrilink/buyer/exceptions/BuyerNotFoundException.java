package com.agrilink.buyer.exceptions;

import com.agrilink.shared.exceptions.ResourceNotFoundException;

public class BuyerNotFoundException extends ResourceNotFoundException {

    public BuyerNotFoundException(String buyerId) {
        super("Buyer with id: " + buyerId +  " not found");
    }
}
