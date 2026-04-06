package com.agrilink.farmer;

import com.agrilink.farmer.dto.FarmerRequest;
import com.agrilink.farmer.dto.FarmerResponse;
import com.agrilink.farmer.dto.FarmerSelfRegisterRequest;
import com.agrilink.farmer.exceptions.DuplicateFarmerPhoneException;
import com.agrilink.farmer.exceptions.FarmerNotFoundException;
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

    public FarmerResponse register(FarmerSelfRegisterRequest request) {
        if (farmerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateFarmerPhoneException(request.getPhoneNumber());
        }

        Farmer farmer = new Farmer();
        farmer.setFullName(request.getFullName());
        farmer.setPhoneNumber(request.getPhoneNumber());
        farmer.setLocation(request.getLocation());
        farmer.setPrimaryCrop(request.getPrimaryCrop());
        farmer.setPreferredLanguage(request.getPreferredLanguage());
        farmer.setPassword(passwordEncoder.encode(request.getPassword()));
        farmer.setHasAppAccess(true);
        farmer.setRegisteredByAgentId(resolveAgent(request.getLocation()));

        return mapToResponse(farmerRepository.save(farmer));
    }


    public FarmerResponse farmerLogin(String phoneNumber, String password) {
        Farmer farmer = farmerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new FarmerNotFoundException(phoneNumber));

        if (!farmer.getHasAppAccess()) {
            throw new ResourceNotFoundException(
                    "This account does not have app access. Please contact your agent."
            );
        }

        if (!passwordEncoder.matches(password, farmer.getPassword())) {
            throw new ResourceNotFoundException("Invalid phone number or password");
        }

        return mapToResponse(farmer);
    }

    public void changePassword(String farmerId, String oldPassword, String newPassword) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));

        if (!passwordEncoder.matches(oldPassword, farmer.getPassword())) {
            throw new ResourceNotFoundException("Current password is incorrect");
        }

        farmer.setPassword(passwordEncoder.encode(newPassword));
        farmerRepository.save(farmer);
    }

    public FarmerResponse updateMyInfo(String farmerId, FarmerRequest request) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));

        farmer.setFullName(request.getFullName());
        farmer.setLocation(request.getLocation());
        farmer.setPrimaryCrop(request.getPrimaryCrop());
        farmer.setPreferredLanguage(request.getPreferredLanguage());

        return mapToResponse(farmerRepository.save(farmer));
    }

    public FarmerResponse viewProfile(String farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));
        return mapToResponse(farmer);
    }

    public Double viewStorageDebt(String farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new FarmerNotFoundException(farmerId));
        return farmer.getStorageDebt();
    }

    public String getMyAgentContact(String farmerId) {
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