package com.agrilink.buyer.dto;

import lombok.Data;

@Data
public class UpdateBuyerRequest {

    private String fullName;
    private String email;
    private String businessName;
    private String location;
}
