package com.agrilink.farmer.dto;

import lombok.Data;

@Data
    public class UpdateFarmerInfoRequest {

        private String fullName;
        private String location;
        private String primaryCrop;
//        private Double farmSize;
        private String preferredLanguage;
        private String phoneNumber;
        private String bankName;
        private String bankAccountNumber;
        private String bankAccountName;
    }

