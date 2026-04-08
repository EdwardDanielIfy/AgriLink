package com.agrilink.agent.exceptions;

import com.agrilink.shared.exceptions.ResourceNotFoundException;

public class AgentNotFoundException extends ResourceNotFoundException {

    public AgentNotFoundException(String agentId) {
        super("Agent with id: " + agentId + " not found");
    }
}