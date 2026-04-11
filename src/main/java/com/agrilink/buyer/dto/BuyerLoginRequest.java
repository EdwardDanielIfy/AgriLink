package com.agrilink.buyer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BuyerLoginRequest {

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    private String password;
}
