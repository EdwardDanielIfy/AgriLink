package com.agrilink.storage;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "storage_facilities")
public class Storage {

    @Id
    @Column(name = "storage_id", updatable = false, nullable = false)
    private String storageId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    private String territory;

    @Column(nullable = false)
    private String partnerName;

    private String partnerFacilityId;

    private String contactPhone;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Double costPerDay;

    private String managedByAgentId;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.storageId = "AGS-" + this.partnerName.replaceAll("[^a-zA-Z0-9]", "").toUpperCase()
                + "-" + this.partnerFacilityId.toUpperCase();
        this.createdAt = LocalDateTime.now();
    }
}