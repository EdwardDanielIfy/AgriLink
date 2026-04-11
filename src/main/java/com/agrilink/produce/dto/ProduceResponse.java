package com.agrilink.produce.dto;

import com.agrilink.shared.enums.ProduceStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProduceResponse {

    private String produceId;
    private String farmerId;
    private String storageId;
    private String agentId;
    private String produceType;
    private Double quantity;
    private String unit;
    private String grade;
    private Double referencePrice;
    private ProduceStatus status;
    private Double accruedStorageCost;
    private LocalDateTime expectedPickupDate;
    private LocalDateTime loggedAt;
    private LocalDateTime lastStorageCostUpdate;
}