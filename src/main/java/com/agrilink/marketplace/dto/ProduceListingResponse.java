package com.agrilink.marketplace.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProduceListingResponse {

    private String produceId;
    private String produceType;
    private Double quantity;
    private String unit;
    private String grade;
    private Double referencePrice;
    private String storageLocation;
    private String territory;
    private String partnerStorageName;
}
