package com.agrilink.farmer;

import com.agrilink.shared.enums.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "farmers")
    public class Farmer {
        @Id
        @Column(name = "farmer_id", updatable = false, nullable = false)
        private String farmerId;

        @Column(name = "full_name", nullable = false)
        private String fullName;

        @Column(name = "phone_number", nullable = false, unique = true)
        private String phoneNumber;

        @Column(name = "location")
        private String location;

        @Column(name = "primary_crop")
        private String primaryCrop;

        @Enumerated(EnumType.STRING)
        @Column(name = "preferred_language", columnDefinition = "VARCHAR(10)")
        private Language preferredLanguage;

        @Column(name = "storage_debt")
        private Double storageDebt = 0.0;

        @Column(name = "password")
        private String password;

        @Column(name = "registered_by_agent_id")
        private String registeredByAgentId;

        @Column(name = "has_app_access")
        private Boolean hasAppAccess;

        @Column(name = "registered_at", updatable = false)
        private LocalDateTime registeredAt;

        @PrePersist
        protected void onCreate() {
            this.farmerId = "AGF-" + this.phoneNumber.replaceAll("[^0-9]", "");
            this.registeredAt = LocalDateTime.now();
            if (this.storageDebt == null) {
                this.storageDebt = 0.0;
            }
            if (this.preferredLanguage == null) {
                this.preferredLanguage = Language.ENGLISH;
            }
            if (this.hasAppAccess == null) {
                this.hasAppAccess = false;
            }
        }
    }
