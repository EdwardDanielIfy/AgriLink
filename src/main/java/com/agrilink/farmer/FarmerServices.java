package com.agrilink.farmer;

import com.agrilink.agent.dto.AgentResponse;
import com.agrilink.farmer.dto.FarmerRegistrationRequest;
import com.agrilink.farmer.dto.FarmerRegistrationResponse;
import com.agrilink.farmer.dto.FarmerSelfRegisterRequest;
import com.agrilink.farmer.dto.UpdateFarmerInfoRequest;
import com.agrilink.farmer.exceptions.DuplicateFarmerPhoneException;
import com.agrilink.farmer.exceptions.FarmerNotFoundException;
import com.agrilink.shared.AgentProfileProvider;
import com.agrilink.shared.AgentTerritoryProvider;
import com.agrilink.shared.FarmerLookupProvider;
import com.agrilink.shared.FarmerRegistrationProvider;
import com.agrilink.shared.config.JwtUtils;
import com.agrilink.shared.enums.Language;
import com.agrilink.shared.exceptions.InvalidOperationException;
import com.agrilink.shared.exceptions.ResourceNotFoundException;
import com.agrilink.shared.exceptions.UnauthorizedActionException;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


import static com.agrilink.farmer.utils.Mapper.mapToResponse;

@Service
@RequiredArgsConstructor
public class FarmerServices implements FarmerRegistrationProvider, FarmerLookupProvider {

    private final FarmerRepository farmerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AgentTerritoryProvider agentTerritoryProvider;
    private final AgentProfileProvider agentProfileProvider;
    private final JwtUtils jwtUtils;

    @Value("${agrilink.default-agent-id}")
    private String defaultAgentId;

    public FarmerRegistrationResponse register(FarmerSelfRegisterRequest request) {
        if (farmerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateFarmerPhoneException(request.getPhoneNumber());
        }

        Farmer farmer = new Farmer();
        farmer.setFullName(request.getFullName());
        farmer.setPhoneNumber(request.getPhoneNumber());
        farmer.setLocation(request.getLocation());
        farmer.setPrimaryCrop(request.getPrimaryCrop());
        if (request.getPreferredLanguage() != null) {
            farmer.setPreferredLanguage(Language.valueOf(request.getPreferredLanguage().toUpperCase()));
        }
        farmer.setPassword(passwordEncoder.encode(request.getPassword()));
        farmer.setHasAppAccess(true);
        farmer.setRegisteredByAgentId(assignAgent(request.getLocation()));
        farmer.setBankAccountName(request.getBankAccountName());
        farmer.setBankAccountNumber(request.getBankAccountNumber());
        farmer.setBankName(request.getBankName());

        return mapToResponse(farmerRepository.save(farmer));
    }

    public String farmerLogin(String phoneNumber, String password) {
        Farmer farmer = farmerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new FarmerNotFoundException(phoneNumber));

        if (!farmer.getHasAppAccess()) {
            throw new UnauthorizedActionException(
                    "This account does not have app access. Please contact your agent."
            );
        }

        if (!passwordEncoder.matches(password, farmer.getPassword())) {
            throw new InvalidOperationException("Invalid phone number or password");
        }

        return jwtUtils.generateToken(farmer.getFarmerId(), "FARMER");
    }

    public void changePassword(String farmerId, String oldPassword, String newPassword) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));

        if (!passwordEncoder.matches(oldPassword, farmer.getPassword())) {
            throw new InvalidOperationException("Current password is incorrect");
        }

        farmer.setPassword(passwordEncoder.encode(newPassword));
        farmerRepository.save(farmer);
    }

    public String updateMyInfo(String farmerId, UpdateFarmerInfoRequest request) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));

        if (request.getFullName() != null) {
            farmer.setFullName(request.getFullName());
        }
        if (request.getLocation() != null) {
            farmer.setLocation(request.getLocation());
        }
        if (request.getPrimaryCrop() != null) {
            farmer.setPrimaryCrop(request.getPrimaryCrop());
        }
        if (request.getPreferredLanguage() != null) {
            farmer.setPreferredLanguage(Language.valueOf(request.getPreferredLanguage().toUpperCase()));
        }
        if (request.getBankAccountNumber() != null) {
            farmer.setBankAccountNumber(request.getBankAccountNumber());
        }
        if (request.getBankAccountName() != null) {
            farmer.setBankAccountName(request.getBankAccountName());
        }
        if (request.getBankName() != null) {
            farmer.setBankName(request.getBankName());
        }
        farmerRepository.save(farmer);
        return "Updated Successfully";
    }

    public FarmerRegistrationResponse viewProfile(String farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));
        return mapToResponse(farmer);
    }

    public Double viewStorageDebt(String farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));
        return farmer.getStorageDebt();
    }

    public AgentResponse getMyAgent(String farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));
        return agentProfileProvider.getMyProfile(farmer.getRegisteredByAgentId());
    }

    public Farmer findByPhoneNumber(String phoneNumber) {
        return farmerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new FarmerNotFoundException(phoneNumber));
    }

    public Farmer findById(String farmerId) {
        return farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));
    }


    private String assignAgent(String location) {
        String agentId = agentTerritoryProvider.findAgentIdByTerritory(location);
        if(agentId == null) {
            agentId = defaultAgentId;
        }
        return agentId;
    }


    public FarmerRegistrationResponse registerFarmerByAgent(FarmerRegistrationRequest request) {
        if (farmerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateFarmerPhoneException(request.getPhoneNumber());
        }

        Farmer farmer = new Farmer();
        farmer.setFullName(request.getFullName());
        farmer.setPhoneNumber(request.getPhoneNumber());
        farmer.setLocation(request.getLocation());
        farmer.setPrimaryCrop(request.getPrimaryCrop());
        if (request.getPreferredLanguage() != null) {
            farmer.setPreferredLanguage(Language.valueOf(request.getPreferredLanguage().toUpperCase()));
        }
        farmer.setHasAppAccess(request.getHasAppAccess() != null ? request.getHasAppAccess() : false);
        farmer.setRegisteredByAgentId(request.getRegisteredByAgentId());
        farmer.setBankAccountNumber(request.getBankAccountNumber());
        farmer.setBankAccountName(request.getBankAccountName());
        farmer.setBankName(request.getBankName());

        return mapToResponse(farmerRepository.save(farmer));
    }

    public FarmerRegistrationResponse getFarmerByIdForAgent(String farmerId, String agentId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));

        if (!agentId.equals(farmer.getRegisteredByAgentId())) {
            throw new UnauthorizedActionException("You are not authorized to view this farmer");
        }
        return mapToResponse(farmer);
    }

    public FarmerRegistrationResponse updateFarmerByAgent(String farmerId, String agentId,UpdateFarmerInfoRequest request) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));

        if (!agentId.equals(farmer.getRegisteredByAgentId())) {
            throw new UnauthorizedActionException(
                    "You are not authorized to update this farmer"
            );
        }

        if (request.getFullName() != null) {
            farmer.setFullName(request.getFullName());
        }
        if (request.getLocation() != null) {
            farmer.setLocation(request.getLocation());
        }
        if (request.getPrimaryCrop() != null) {
            farmer.setPrimaryCrop(request.getPrimaryCrop());
        }
        if (request.getPreferredLanguage() != null) {
            farmer.setPreferredLanguage(
                    Language.valueOf(request.getPreferredLanguage().toUpperCase())
            );
        }
        if (request.getBankAccountNumber() != null) {
            farmer.setBankAccountNumber(request.getBankAccountNumber());
        }
        if (request.getBankAccountName() != null) {
            farmer.setBankAccountName(request.getBankAccountName());
        }
        if (request.getBankName() != null) {
            farmer.setBankName(request.getBankName());
        }

        return mapToResponse(farmerRepository.save(farmer));
    }

    public List<FarmerRegistrationResponse> getFarmersByAgent(String agentId) {
        List<Farmer> farmers = farmerRepository.findAllByRegisteredByAgentId(agentId);
        List<FarmerRegistrationResponse> responses = new ArrayList<>();

        for (Farmer farmer : farmers) {
            responses.add(mapToResponse(farmer));
        }
        return responses;
    }

    public void updateStorageDebt(String farmerId, Double storageDebt) {
        Farmer farmer = farmerRepository.findById(farmerId).orElseThrow(() -> new FarmerNotFoundException(farmerId));
        farmer.setStorageDebt(storageDebt);
        farmerRepository.save(farmer);
    }
}