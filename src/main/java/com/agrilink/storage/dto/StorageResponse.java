package com.agrilink.storage.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StorageResponse {

    private String storageId;
    private String name;
    private String location;
    private String territory;
    private String partnerName;
    private String partnerFacilityId;
    private String contactPhone;
    private Integer capacity;
    private Integer availableSlots;
    private Double costPerDay;
    private String managedByAgentId;
    private LocalDateTime createdAt;
}
