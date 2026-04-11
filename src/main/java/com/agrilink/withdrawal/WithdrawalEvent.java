package com.agrilink.withdrawal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "withdrawal_events")
public class WithdrawalEvent {

    @Id
    @Column(updatable = false, nullable = false)
    private String withdrawalId;

    @Column(nullable = false)
    private String produceId;

    @Column(nullable = false)
    private String farmerId;

    @Column(nullable = false)
    private String agentId;

    private Double storageCostAtWithdrawal;

    private String reason;

    @Column(updatable = false)
    private LocalDateTime withdrawnAt;

    @PrePersist
    protected void onCreate() {
        this.withdrawalId = "AGW-" + System.currentTimeMillis();
        this.withdrawnAt = LocalDateTime.now();
    }
}