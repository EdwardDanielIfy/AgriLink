package com.agrilink.produce.exceptions;

import com.agrilink.shared.exceptions.ResourceNotFoundException;

public class ProduceNotFoundException extends ResourceNotFoundException {

    public ProduceNotFoundException(String produceId) {
        super("Produce with id: " + produceId + "not found");
    }
}
