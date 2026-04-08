package com.agrilink.agent.dto;

import lombok.Data;

@Data
public class UpdateAgentRequest {

    private String fullName;
    private String email;
    private String territory;
}