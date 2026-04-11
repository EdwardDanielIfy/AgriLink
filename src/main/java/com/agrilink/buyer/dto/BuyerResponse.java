package com.agrilink.buyer.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BuyerResponse {

    private String buyerId;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String businessName;
    private String location;
    private LocalDateTime registeredAt;
}
