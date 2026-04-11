package com.agrilink.agent;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "agents")
    public class Agent {

        @Id
        @Column(name = "agent_id", updatable = false, nullable = false)
        private String agentId;

        @Column(name = "full_name", nullable = false)
        private String fullName;

        @Column(name = "phone_number", nullable = false, unique = true)
        private String phoneNumber;

        @Column(name = "email", unique = true)
        private String email;

        @Column(name = "territory")
        private String territory;

        @Column(name = "password", nullable = false)
        private String password;

        @Column(name = "registered_at", updatable = false)
        private LocalDateTime registeredAt;

        @PrePersist
        protected void onCreate() {
            this.agentId = "AGA-" + this.phoneNumber.replaceAll("[^0-9]", "");
            this.registeredAt = LocalDateTime.now();
        }
    }

