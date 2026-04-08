package com.agrilink.farmer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
    public class FarmerLoginRequest {

        @NotBlank(message = "Phone number is required")
        private String phoneNumber;

        @NotBlank(message = "Password is required")
        private String password;
    }

