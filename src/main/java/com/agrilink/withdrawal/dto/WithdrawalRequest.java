package com.agrilink.withdrawal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WithdrawalRequest {

    @NotBlank(message = "Produce ID is required")
    private String produceId;

    @NotBlank(message = "Farmer ID is required")
    private String farmerId;

    @NotBlank(message = "Agent ID is required")
    private String agentId;

    private String reason;
}
