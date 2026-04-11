package com.agrilink.buyer;

import com.agrilink.buyer.dto.*;
import com.agrilink.shared.APIResponse;
import com.agrilink.shared.dto.ChangePasswordRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buyers")
@RequiredArgsConstructor
public class BuyerController {

    private final BuyerServices buyerServices;

    @PostMapping("/register")
    public ResponseEntity<APIResponse> register(@Valid @RequestBody BuyerRegisterRequest request) {
        return new ResponseEntity<>(new APIResponse(true, buyerServices.register(request)), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<APIResponse> login(@Valid @RequestBody BuyerLoginRequest request) {
        return new ResponseEntity<>(new APIResponse(true, buyerServices.login(request.getPhoneNumber(), request.getPassword())), HttpStatus.OK);
    }

    @PutMapping("/{buyerId}/change-password")
    public ResponseEntity<APIResponse> changePassword(@PathVariable String buyerId, @Valid @RequestBody ChangePasswordRequest request) {buyerServices.changePassword(buyerId, request);
        return new ResponseEntity<>(new APIResponse(true, "Password changed successfully"), HttpStatus.OK);
    }

    @GetMapping("/{buyerId}")
    public ResponseEntity<APIResponse> getMyProfile(@PathVariable String buyerId) {
        return new ResponseEntity<>(new APIResponse(true, buyerServices.getMyProfile(buyerId)), HttpStatus.OK);
    }

    @PutMapping("/{buyerId}")
    public ResponseEntity<APIResponse> updateMyInfo(@PathVariable String buyerId, @RequestBody UpdateBuyerRequest request) {
        return new ResponseEntity<>(new APIResponse(true, buyerServices.updateMyInfo(buyerId, request)), HttpStatus.OK);
    }
}
