package com.agrilink.transaction;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @Column(name = "transaction_id", updatable = false, nullable = false)
    private String transactionId;

    @Column(nullable = false)
    private String produceId;

    @Column(nullable = false)
    private String farmerId;

    @Column(nullable = false)
    private String buyerId;

    private String agentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(30)")
    private TransactionStatus status;

    @Column(nullable = false)
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

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.transactionId = "AGT-" + this.buyerId.replaceAll("[^0-9]", "") + "-" + System.currentTimeMillis();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = TransactionStatus.OFFER_MADE;
        this.offerResponseDeadline = LocalDateTime.now().plusHours(24);
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
