package com.agrilink.agent.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AgentStatsResponse {
    private long totalFarmers;
    private long pendingFarmers;
    private long assignedHubs;
    private double totalCommission;
    private String farmersTrend;
}
