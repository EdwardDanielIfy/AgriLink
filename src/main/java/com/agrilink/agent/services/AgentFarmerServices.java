package com.agrilink.agent.services;

import com.agrilink.agent.AgentRepository;
import com.agrilink.agent.exceptions.AgentNotFoundException;
import com.agrilink.farmer.dto.FarmerRegistrationRequest;
import com.agrilink.farmer.dto.FarmerRegistrationResponse;
import com.agrilink.farmer.dto.UpdateFarmerInfoRequest;
import com.agrilink.shared.FarmerLookupProvider;
import com.agrilink.shared.FarmerRegistrationProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentFarmerServices {

    private final AgentRepository agentRepository;
    private final FarmerRegistrationProvider farmerRegistrationProvider;
    private final FarmerLookupProvider farmerLookupProvider;

    public FarmerRegistrationResponse registerFarmer(String agentId, FarmerRegistrationRequest request) {
        agentRepository.findById(agentId)
                .orElseThrow(() -> new AgentNotFoundException(agentId));
        request.setRegisteredByAgentId(agentId);
        return farmerRegistrationProvider.registerFarmerByAgent(request);
    }

    public FarmerRegistrationResponse getFarmerById(String agentId, String farmerId) {
        agentRepository.findById(agentId)
                .orElseThrow(() -> new AgentNotFoundException(agentId));
        return farmerLookupProvider.getFarmerByIdForAgent(farmerId, agentId);
    }

    public List<FarmerRegistrationResponse> getMyFarmers(String agentId) {
        agentRepository.findById(agentId)
                .orElseThrow(() -> new AgentNotFoundException(agentId));
        return farmerLookupProvider.getFarmersByAgent(agentId);
    }

    public FarmerRegistrationResponse updateFarmer(String agentId, String farmerId, UpdateFarmerInfoRequest request) {
        agentRepository.findById(agentId)
                .orElseThrow(() -> new AgentNotFoundException(agentId));
        return farmerLookupProvider.updateFarmerByAgent(farmerId, agentId, request);
    }
}
