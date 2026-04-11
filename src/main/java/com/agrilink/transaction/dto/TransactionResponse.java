package com.agrilink.transaction.dto;

import com.agrilink.transaction.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {

    private String transactionId;
    private String produceId;
    private String farmerId;
    private String buyerId;
    private String agentId;
    private TransactionStatus status;
    private Double offeredPrice;
    private Double quantitySold;
    private Double commissionAmount;
    private Double storageCostDeducted;
    private Double farmerNetPayout;
    private String logisticsPartner;
    private String logisticsTrackingNumber;
    private String paymentReference;
    private LocalDateTime offerResponseDeadline;
    private LocalDateTime paymentConfirmedAt;
    private LocalDateTime logisticsConfirmedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime paidToFarmerAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
