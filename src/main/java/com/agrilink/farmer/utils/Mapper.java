package com.agrilink.farmer.utils;

import com.agrilink.farmer.Farmer;
import com.agrilink.farmer.dto.FarmerResponse;

public class Mapper {

    public static FarmerResponse mapToResponse(Farmer farmer) {
        return FarmerResponse.builder()
                .farmerId(farmer.getFarmerId())
                .fullName(farmer.getFullName())
                .phoneNumber(farmer.getPhoneNumber())
                .location(farmer.getLocation())
                .primaryCrop(farmer.getPrimaryCrop())
                .preferredLanguage(farmer.getPreferredLanguage())
                .storageDebt(farmer.getStorageDebt())
                .registeredByAgentId(farmer.getRegisteredByAgentId())
                .registeredAt(farmer.getRegisteredAt())
                .build();
    }
}
