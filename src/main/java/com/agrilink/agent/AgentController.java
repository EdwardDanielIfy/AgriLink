package com.agrilink.agent;

import com.agrilink.agent.dto.*;
import com.agrilink.agent.services.AgentFarmerServices;
import com.agrilink.agent.services.AgentServices;
import com.agrilink.shared.dto.ChangePasswordRequest;
import com.agrilink.farmer.dto.FarmerRegistrationRequest;
import com.agrilink.farmer.dto.UpdateFarmerInfoRequest;
import com.agrilink.shared.APIResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentServices agentServices;
    private final AgentFarmerServices agentFarmerServices;

    @PostMapping("/register")
    public ResponseEntity<APIResponse> register(@Valid @RequestBody AgentRegisterRequest request) {
        return new ResponseEntity<>(new APIResponse(true, agentServices.register(request)), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<APIResponse> login(@Valid @RequestBody AgentLoginRequest request) {
        return new ResponseEntity<>(new APIResponse(true, agentServices.agentLogin(request.getPhoneNumber(), request.getPassword())), HttpStatus.OK);
    }

    @PutMapping("/{agentId}/change-password")
    public ResponseEntity<APIResponse> changePassword(@PathVariable String agentId, @Valid @RequestBody ChangePasswordRequest request) {
        agentServices.changePassword(agentId, request.getOldPassword(), request.getNewPassword());
        return new ResponseEntity<>(new APIResponse(true, "Password changed successfully"), HttpStatus.OK);
    }

    @GetMapping("/{agentId}")
    public ResponseEntity<APIResponse> getMyProfile(@PathVariable String agentId) {
        return new ResponseEntity<>(new APIResponse(true, agentServices.getMyProfile(agentId)), HttpStatus.OK);
    }

    @PutMapping("/{agentId}")
    public ResponseEntity<APIResponse> updateMyInfo(@PathVariable String agentId, @RequestBody UpdateAgentRequest request) {
        return new ResponseEntity<>(new APIResponse(true, agentServices.updateMyInfo(agentId, request)), HttpStatus.OK);
    }

    @PostMapping("/{agentId}/farmers")
    public ResponseEntity<APIResponse> registerFarmer(@PathVariable String agentId, @Valid @RequestBody FarmerRegistrationRequest request) {
        return new ResponseEntity<>(new APIResponse(true, agentFarmerServices.registerFarmer(agentId, request)), HttpStatus.CREATED);
    }

    @GetMapping("/{agentId}/farmers")
    public ResponseEntity<APIResponse> getMyFarmers(@PathVariable String agentId) {
        return new ResponseEntity<>(new APIResponse(true, agentFarmerServices.getMyFarmers(agentId)), HttpStatus.OK);
    }

    @GetMapping("/{agentId}/farmers/{farmerId}")
    public ResponseEntity<APIResponse> getFarmerById(@PathVariable String agentId, @PathVariable String farmerId) {
        return new ResponseEntity<>(new APIResponse(true, agentFarmerServices.getFarmerById(agentId, farmerId)), HttpStatus.OK);
    }

    @PutMapping("/{agentId}/farmers/{farmerId}")
    public ResponseEntity<APIResponse> updateFarmer(@PathVariable String agentId, @PathVariable String farmerId, @RequestBody UpdateFarmerInfoRequest request) {
        return new ResponseEntity<>(new APIResponse(true, agentFarmerServices.updateFarmer(agentId, farmerId, request)), HttpStatus.OK);
    }
}