package com.agrilink.farmer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class FarmerRegistrationRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber;

    @NotBlank(message = "Location is required")
    private String location;

    private String primaryCrop;

    private String preferredLanguage;

    private Boolean hasAppAccess;

    private String registeredByAgentId;

    private String bankAccountNumber;

    private String bankAccountName;

    private String bankName;
}



