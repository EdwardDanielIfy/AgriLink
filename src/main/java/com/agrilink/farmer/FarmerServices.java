package com.agrilink.farmer;

import com.agrilink.farmer.dto.FarmerRegistrationResponse;
import com.agrilink.farmer.dto.FarmerSelfRegisterRequest;
import com.agrilink.farmer.dto.UpdateFarmerInfoRequest;
import com.agrilink.farmer.exceptions.DuplicateFarmerPhoneException;
import com.agrilink.farmer.exceptions.FarmerNotFoundException;
import com.agrilink.shared.enums.Language;
import com.agrilink.shared.exceptions.InvalidOperationException;
import com.agrilink.shared.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import static com.agrilink.farmer.utils.Mapper.mapToResponse;

@Service
@RequiredArgsConstructor
public class FarmerServices {

    private final FarmerRepository farmerRepository;
    private final PasswordEncoder passwordEncoder;

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
        farmer.setRegisteredByAgentId(resolveAgent(request.getLocation()));
        farmer.setBankAccountName(request.getBankAccountName());
        farmer.setBankAccountNumber(request.getBankAccountNumber());
        farmer.setBankName(request.getBankName());

        return mapToResponse(farmerRepository.save(farmer));
    }


    public String farmerLogin(String phoneNumber, String password) {
        Farmer farmer = farmerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new FarmerNotFoundException(phoneNumber));

        if (!farmer.getHasAppAccess()) {
            throw new ResourceNotFoundException(
                    "This account does not have app access. Please contact your agent."
            );
        }

        if (!passwordEncoder.matches(password, farmer.getPassword())) {
            throw new FarmerNotFoundException("Invalid phone number or password");
        }

        return "Login successful";
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

    public String getMyAgent(String farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));
        return farmer.getRegisteredByAgentId();
    }

    public Farmer findByPhoneNumber(String phoneNumber) {
        return farmerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new FarmerNotFoundException(phoneNumber));
    }

    public Farmer findById(String farmerId) {
        return farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));
    }


    private String resolveAgent(String location) {
        return defaultAgentId;
//        return farmerRepository.findAgentByTerritory(location)
//                .orElse(defaultAgentId);
    }
}