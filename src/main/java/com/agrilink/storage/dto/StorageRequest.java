package com.agrilink.storage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class StorageRequest {

    @NotBlank(message = "Storage name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    private String territory;

    @NotBlank(message = "Partner name is required")
    private String partnerName;

    @NotBlank(message = "Partner facility ID is required")
    private String partnerFacilityId;

    private String contactPhone;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be greater than zero")
    private Integer capacity;

    @NotNull(message = "Cost per day is required")
    @Positive(message = "Cost per day must be greater than zero")
    private Double costPerDay;

    private String managedByAgentId;
}