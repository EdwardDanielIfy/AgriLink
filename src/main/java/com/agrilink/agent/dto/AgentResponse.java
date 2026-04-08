package com.agrilink.agent.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AgentResponse {

    private String agentId;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String territory;
    private LocalDateTime registeredAt;
}
