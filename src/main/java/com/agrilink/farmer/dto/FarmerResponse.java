package com.agrilink.farmer.dto;

import com.agrilink.shared.enums.Language;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class FarmerResponse {
        private String farmerId;
        private String fullName;
        private String phoneNumber;
        private String location;
        private String primaryCrop;
        private Language preferredLanguage;
        private Double storageDebt;
        private Boolean hasAppAccess;
        private String registeredByAgentId;
        private LocalDateTime registeredAt;
    }

