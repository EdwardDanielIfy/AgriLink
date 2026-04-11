package com.agrilink.transaction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransactionRequest {

    @NotBlank(message = "Produce ID is required")
    private String produceId;

    @NotBlank(message = "Farmer ID is required")
    private String farmerId;

    @NotBlank(message = "Buyer ID is required")
    private String buyerId;

    @NotNull(message = "Offered price is required")
    @Positive(message = "Offered price must be greater than zero")
    private Double offeredPrice;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    private Double quantitySold;

    private String logisticsPartner;
}
