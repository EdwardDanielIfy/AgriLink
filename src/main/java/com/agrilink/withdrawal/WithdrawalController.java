package com.agrilink.withdrawal;

import com.agrilink.shared.APIResponse;
import com.agrilink.withdrawal.dto.WithdrawalRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/withdrawals")
@RequiredArgsConstructor
public class WithdrawalController {

    private final WithdrawalServices withdrawalServices;

    @PostMapping
    public ResponseEntity<APIResponse> processWithdrawal(
            @Valid @RequestBody WithdrawalRequest request) {
        return new ResponseEntity<>(
                new APIResponse(true, withdrawalServices.processWithdrawal(request)),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{withdrawalId}")
    public ResponseEntity<APIResponse> getWithdrawalById(
            @PathVariable String withdrawalId) {
        return new ResponseEntity<>(
                new APIResponse(true, withdrawalServices.getWithdrawalById(withdrawalId)),
                HttpStatus.OK
        );
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<APIResponse> getWithdrawalsByFarmer(
            @PathVariable String farmerId) {
        return new ResponseEntity<>(
                new APIResponse(true, withdrawalServices.getWithdrawalsByFarmer(farmerId)),
                HttpStatus.OK
        );
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<APIResponse> getWithdrawalsByAgent(
            @PathVariable String agentId) {
        return new ResponseEntity<>(
                new APIResponse(true, withdrawalServices.getWithdrawalsByAgent(agentId)),
                HttpStatus.OK
        );
    }
}