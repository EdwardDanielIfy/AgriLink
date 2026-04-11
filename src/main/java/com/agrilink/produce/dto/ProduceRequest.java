package com.agrilink.produce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProduceRequest {

    @NotBlank(message = "Farmer ID is required")
    private String farmerId;

    @NotBlank(message = "Storage ID is required")
    private String storageId;

    private String agentId;

    @NotBlank(message = "Produce type is required")
    private String produceType;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    private Double quantity;

    @NotBlank(message = "Unit is required")
    private String unit;

    private String grade;

    @NotNull(message = "Reference price is required")
    @Positive(message = "Reference price must be greater than zero")
    private Double referencePrice;

    private LocalDateTime expectedPickupDate;
}
