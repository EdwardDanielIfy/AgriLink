package com.agrilink.buyer;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "buyers")
public class Buyer {

    @Id
    @Column(name = "buyer_id", updatable = false, nullable = false)
    private String buyerId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String businessName;

    private String location;

    @Column(updatable = false)
    private LocalDateTime registeredAt;

    @PrePersist
    protected void onCreate() {
        this.buyerId = "AGB-" + this.phoneNumber.replaceAll("[^0-9]", "");
        this.registeredAt = LocalDateTime.now();
    }
}
