package com.agrilink.sms;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Entity
@Table(name = "sms_notifications")
@NoArgsConstructor
public class SmsNotification {

    @Id
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(nullable = false)
    private String recipientPhone;

    private String farmerId;

    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    private SmsType smsType;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private boolean delivered;

    private String failureReason;

    @Column(updatable = false)
    private LocalDateTime sentAt;

    @PrePersist
    protected void onCreate() {
        this.id = "SMS-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.sentAt = LocalDateTime.now();
    }
}
