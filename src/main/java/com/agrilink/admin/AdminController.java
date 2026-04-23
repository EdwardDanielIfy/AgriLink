package com.agrilink.admin;

import com.agrilink.admin.dto.AdminLoginRequest;
import com.agrilink.agent.dto.AgentRegisterRequest;
import com.agrilink.shared.APIResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminServices adminServices;

    @PostMapping("/login")
    public ResponseEntity<APIResponse> login(@Valid @RequestBody AdminLoginRequest request) {
        return new ResponseEntity<>(new APIResponse(true, adminServices.login(request)), HttpStatus.OK);
    }

    @PostMapping("/agents/register")
    public ResponseEntity<APIResponse> registerAgent(@Valid @RequestBody AgentRegisterRequest request) {
        return new ResponseEntity<>(new APIResponse(true, adminServices.registerAgent(request)), HttpStatus.CREATED);
    }

    @GetMapping("/agents")
    public ResponseEntity<APIResponse> getAllAgents() {
        return new ResponseEntity<>(new APIResponse(true, adminServices.getAllAgents()), HttpStatus.OK);
    }

    @GetMapping("/agents/{agentId}")
    public ResponseEntity<APIResponse> getAgentById(@PathVariable String agentId) {
        return new ResponseEntity<>(new APIResponse(true, adminServices.getAgentById(agentId)), HttpStatus.OK);
    }

    @GetMapping("/farmers")
    public ResponseEntity<APIResponse> getAllFarmers() {
        return new ResponseEntity<>(new APIResponse(true, adminServices.getAllFarmers()), HttpStatus.OK);
    }

    @GetMapping("/farmers/{farmerId}")
    public ResponseEntity<APIResponse> getFarmerById(@PathVariable String farmerId) {
        return new ResponseEntity<>(new APIResponse(true, adminServices.getFarmerById(farmerId)), HttpStatus.OK);
    }

    @PutMapping("/farmers/{farmerId}/assign-agent/{agentId}")
    public ResponseEntity<APIResponse> assignAgentToFarmer(@PathVariable String farmerId, @PathVariable String agentId) {
        return new ResponseEntity<>(new APIResponse(true, adminServices.assignAgentToFarmer(farmerId, agentId)), HttpStatus.OK);
    }

    @GetMapping("/transactions")
    public ResponseEntity<APIResponse> getAllTransactions() {
        return new ResponseEntity<>(new APIResponse(true, adminServices.getAllTransactions()), HttpStatus.OK);
    }

    @GetMapping("/transactions/{transactionId}")
    public ResponseEntity<APIResponse> getTransactionById(@PathVariable String transactionId) {
        return new ResponseEntity<>(new APIResponse(true, adminServices.getTransactionById(transactionId)), HttpStatus.OK);
    }
}