package com.agrilink.produce;

import com.agrilink.shared.enums.ProduceStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "produce")
public class Produce {

    @Id
    @Column(name = "produce_id", updatable = false, nullable = false)
    private String produceId;

    @Column(nullable = false)
    private String farmerId;

    private String storageId;

    private String agentId;

    @Column(nullable = false)
    private String produceType;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String unit;

    private String grade;

    @Column(nullable = false)
    private Double referencePrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(30)")
    private ProduceStatus status;

    private Double accruedStorageCost;

    private LocalDateTime expectedPickupDate;

    @Column(updatable = false)
    private LocalDateTime loggedAt;

    private LocalDateTime lastStorageCostUpdate;

    @PrePersist
    protected void onCreate() {
        this.produceId = "AGP-" + this.farmerId.replaceAll("[^0-9]", "")
                + "-" + System.currentTimeMillis();
        this.loggedAt = LocalDateTime.now();
        this.lastStorageCostUpdate = LocalDateTime.now();
        this.status = (this.storageId == null)
                ? ProduceStatus.PENDING_HUB_ASSIGNMENT
                : ProduceStatus.AVAILABLE;
        if (this.accruedStorageCost == null) {
            this.accruedStorageCost = 0.0;
        }
    }
}