package com.agrilink.farmer.dto;

import com.agrilink.shared.enums.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

    @Data
    public class FarmerSelfRegisterRequest {

        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format")
        private String phoneNumber;

        @NotBlank(message = "Location is required")
        private String location;

        private String primaryCrop;

        private String preferredLanguage;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        private String bankAccountNumber;
        private String bankAccountName;
        private String bankName;
    }

