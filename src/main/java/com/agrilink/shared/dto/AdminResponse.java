package com.agrilink.shared.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminResponse {
    private String adminId;
    private String fullName;
    private String email;
}
