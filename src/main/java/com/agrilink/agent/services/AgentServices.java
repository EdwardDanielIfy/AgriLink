package com.agrilink.agent.services;

import com.agrilink.agent.Agent;
import com.agrilink.agent.AgentRepository;
import com.agrilink.agent.dto.*;
import com.agrilink.agent.exceptions.AgentNotFoundException;
import com.agrilink.agent.exceptions.DuplicateAgentPhoneException;
import com.agrilink.shared.AgentProfileProvider;
import com.agrilink.shared.AgentTerritoryProvider;
import com.agrilink.shared.exceptions.InvalidOperationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class AgentServices implements AgentProfileProvider, AgentTerritoryProvider {

    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;

    public AgentResponse register(AgentRegisterRequest request) {
        if (agentRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateAgentPhoneException(request.getPhoneNumber());
        }

        Agent agent = new Agent();
        agent.setFullName(request.getFullName());
        agent.setPhoneNumber(request.getPhoneNumber());
        agent.setEmail(request.getEmail());
        agent.setTerritory(request.getTerritory());
        agent.setPassword(passwordEncoder.encode(request.getPassword()));

        return mapToResponse(agentRepository.save(agent));
    }

    public String agentLogin(String phoneNumber, String password) {
        Agent agent = agentRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new AgentNotFoundException(phoneNumber));

        if (!passwordEncoder.matches(password, agent.getPassword())) {
            throw new InvalidOperationException("Invalid phone number or password");
        }

        return "Login successful";
    }

    public void changePassword(String agentId, String oldPassword, String newPassword) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new AgentNotFoundException(agentId));

        if (!passwordEncoder.matches(oldPassword, agent.getPassword())) {
            throw new InvalidOperationException("Current password is incorrect");
        }

        agent.setPassword(passwordEncoder.encode(newPassword));
        agentRepository.save(agent);
    }


    public AgentResponse getMyProfile(String agentId) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new AgentNotFoundException(agentId));
        return mapToResponse(agent);
    }

    public AgentResponse updateMyInfo(String agentId, UpdateAgentRequest request) {
        Agent agent = agentRepository.findById(agentId).orElseThrow(() -> new AgentNotFoundException(agentId));

        if (request.getFullName() != null) {
            agent.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            agent.setEmail(request.getEmail());
        }
        if (request.getTerritory() != null) {
            agent.setTerritory(request.getTerritory());
        }

        return mapToResponse(agentRepository.save(agent));
    }

    public Agent findById(String agentId) {
        return agentRepository.findById(agentId)
                .orElseThrow(() -> new AgentNotFoundException(agentId));
    }

    private AgentResponse mapToResponse(Agent agent) {
        return AgentResponse.builder()
                .agentId(agent.getAgentId())
                .fullName(agent.getFullName())
                .phoneNumber(agent.getPhoneNumber())
                .email(agent.getEmail())
                .territory(agent.getTerritory())
                .registeredAt(agent.getRegisteredAt())
                .build();
    }

    @Override
    public String findAgentIdByTerritory(String territory) {
        return agentRepository.findByTerritory(territory)
                .map(Agent::getAgentId)
                .orElse(null);
    }
    }
