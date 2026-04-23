package com.agrilink.farmer.dto;

import com.agrilink.shared.enums.Language;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FarmerRegistrationResponse {
        private String farmerId;
        private String fullName;
        private String phoneNumber;
        private String location;
        private String primaryCrop;
//        private Double farmSize;
        private Language preferredLanguage;
        private Double storageDebt;
        private Boolean hasAppAccess;
        private String registeredByAgentId;
        private LocalDateTime registeredAt;
        private String bankAccountNumber;
        private String bankAccountName;
        private String bankName;
    }

