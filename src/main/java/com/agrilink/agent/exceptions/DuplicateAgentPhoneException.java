package com.agrilink.agent.exceptions;

import com.agrilink.shared.exceptions.DuplicateResourceException;

public class DuplicateAgentPhoneException extends DuplicateResourceException {
    public DuplicateAgentPhoneException(String phone) {
        super("An agent with phone number " + phone + " already exists");
    }
}
