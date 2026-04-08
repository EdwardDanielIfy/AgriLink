package com.agrilink.farmer.utils;

import com.agrilink.farmer.Farmer;
import com.agrilink.farmer.dto.FarmerRegistrationResponse;

public class Mapper {

    public static FarmerRegistrationResponse mapToResponse(Farmer farmer) {
        return FarmerRegistrationResponse.builder()
                .farmerId(farmer.getFarmerId())
                .fullName(farmer.getFullName())
                .phoneNumber(farmer.getPhoneNumber())
                .location(farmer.getLocation())
                .primaryCrop(farmer.getPrimaryCrop())
                .preferredLanguage(farmer.getPreferredLanguage())
                .storageDebt(farmer.getStorageDebt())
                .registeredByAgentId(farmer.getRegisteredByAgentId())
                .registeredAt(farmer.getRegisteredAt())
                .bankName(farmer.getBankName())
                .bankAccountNumber(farmer.getBankAccountNumber())
                .bankAccountName(farmer.getBankAccountName())
                .build();
    }
}
