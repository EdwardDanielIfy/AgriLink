package com.agrilink.withdrawal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WithdrawalResponse {

    private String withdrawalId;
    private String produceId;
    private String farmerId;
    private String agentId;
    private Double storageCostAtWithdrawal;
    private String reason;
    private LocalDateTime withdrawnAt;
}
