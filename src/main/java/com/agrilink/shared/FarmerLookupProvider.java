package com.agrilink.shared;

import com.agrilink.farmer.dto.FarmerRegistrationResponse;
import com.agrilink.farmer.dto.UpdateFarmerInfoRequest;

import java.util.List;

public interface FarmerLookupProvider {
        FarmerRegistrationResponse getFarmerByIdForAgent(String farmerId, String agentId);

        List<FarmerRegistrationResponse> getFarmersByAgent(String agentId);

        FarmerRegistrationResponse updateFarmerByAgent(String farmerId, String agentId, UpdateFarmerInfoRequest request);
    }
