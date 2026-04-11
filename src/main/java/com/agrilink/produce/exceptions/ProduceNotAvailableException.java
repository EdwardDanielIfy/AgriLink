package com.agrilink.produce.exceptions;

import com.agrilink.shared.exceptions.InvalidOperationException;

public class ProduceNotAvailableException extends InvalidOperationException {

    public ProduceNotAvailableException(String produceId) {
        super("Produce with id: " + produceId + " is not available for this operation");
    }
}
