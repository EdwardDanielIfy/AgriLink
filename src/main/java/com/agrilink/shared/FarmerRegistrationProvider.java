package com.agrilink.shared;

import com.agrilink.farmer.dto.FarmerRegistrationRequest;
import com.agrilink.farmer.dto.FarmerRegistrationResponse;


public interface FarmerRegistrationProvider {
    FarmerRegistrationResponse registerFarmerByAgent(FarmerRegistrationRequest request);
}