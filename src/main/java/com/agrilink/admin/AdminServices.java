package com.agrilink.admin;

import com.agrilink.admin.dto.AdminLoginRequest;
import com.agrilink.agent.dto.AgentRegisterRequest;
import com.agrilink.agent.dto.AgentResponse;
import com.agrilink.agent.services.AgentServices;
import com.agrilink.farmer.FarmerServices;
import com.agrilink.farmer.dto.FarmerRegistrationResponse;
import com.agrilink.shared.config.JwtUtils;
import com.agrilink.shared.dto.AdminResponse;
import com.agrilink.shared.dto.AuthResponse;
import com.agrilink.shared.exceptions.InvalidOperationException;
import com.agrilink.transaction.TransactionServices;
import com.agrilink.transaction.dto.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServices {


    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AgentServices agentServices;
    private final FarmerServices farmerServices;
    private final TransactionServices transactionServices;

    @Value("${agrilink.admin.email}")
    private String adminEmail;

    @Value("${agrilink.admin.password}")
    private String adminPassword;


    public AuthResponse login(AdminLoginRequest request) {
        if (!request.getEmail().equals(adminEmail)) {
            throw new InvalidOperationException("Invalid email or password");
        }

        if (!request.getPassword().equals(adminPassword)) {
            throw new InvalidOperationException("Invalid email or password");
        }

        String token = jwtUtils.generateToken("AGADM-001", "ADMIN");
        return AuthResponse.builder()
                .token(token)
                .user(AdminResponse.builder()
                        .adminId("AGADM-001")
                        .fullName("System Administrator")
                        .email(adminEmail)
                        .build())
                .build();
    }


    public AgentResponse registerAgent(AgentRegisterRequest request) {
        return agentServices.register(request);
    }

    public List<AgentResponse> getAllAgents() {
        return agentServices.getAllAgents();
    }

    public AgentResponse getAgentById(String agentId) {
        return agentServices.getMyProfile(agentId);
    }

    public List<FarmerRegistrationResponse> getAllFarmers() {
        return farmerServices.getAllFarmers();
    }

    public FarmerRegistrationResponse getFarmerById(String farmerId) {
        return farmerServices.viewProfile(farmerId);
    }

    public FarmerRegistrationResponse assignAgentToFarmer(String farmerId, String agentId) {
        return farmerServices.assignAgent(farmerId, agentId);
    }


    public List<TransactionResponse> getAllTransactions() {
        return transactionServices.getAllTransactions();
    }

    public TransactionResponse getTransactionById(String transactionId) {
        return transactionServices.getTransactionById(transactionId);
    }

}