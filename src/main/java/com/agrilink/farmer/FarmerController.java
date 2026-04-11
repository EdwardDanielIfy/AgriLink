package com.agrilink.farmer;

import com.agrilink.farmer.dto.*;
import com.agrilink.shared.APIResponse;
import com.agrilink.shared.dto.ChangePasswordRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/api/farmers")
    @RequiredArgsConstructor
    public class FarmerController {

        private final FarmerServices farmerServices;

        @PostMapping("/register")
        public ResponseEntity<APIResponse> selfRegister(@Valid @RequestBody FarmerSelfRegisterRequest request) {
            return new ResponseEntity<>(new APIResponse(true, farmerServices.register(request)), HttpStatus.CREATED);
        }

        @PostMapping("/login")
        public ResponseEntity<APIResponse> login(@Valid @RequestBody FarmerLoginRequest request) {
            return new ResponseEntity<>(new APIResponse(true, farmerServices.farmerLogin(request.getPhoneNumber(), request.getPassword())), HttpStatus.OK);
        }

        @PutMapping("/{farmerId}/change-password")
        public ResponseEntity<APIResponse> changePassword(@PathVariable String farmerId, @Valid @RequestBody ChangePasswordRequest request) {
            farmerServices.changePassword(farmerId, request.getOldPassword(), request.getNewPassword());
            return new ResponseEntity<>(new APIResponse(true, "Password changed successfully"), HttpStatus.OK);
        }

        @GetMapping("/{farmerId}")
        public ResponseEntity<APIResponse> viewMyProfile(@PathVariable String farmerId) {
            return new ResponseEntity<>(new APIResponse(true, farmerServices.viewProfile((farmerId))), HttpStatus.OK);
        }

        @PutMapping("/{farmerId}")
        public ResponseEntity<APIResponse> updateMyInfo(@PathVariable String farmerId, @RequestBody UpdateFarmerInfoRequest request) {
            return new ResponseEntity<>(new APIResponse(true, farmerServices.updateMyInfo(farmerId, request)),HttpStatus.OK);
        }

        @GetMapping("/{farmerId}/storage-debt")
        public ResponseEntity<APIResponse> getMyStorageDebt(@PathVariable String farmerId) {return new ResponseEntity<>(
                    new APIResponse(true, farmerServices.viewStorageDebt(farmerId)), HttpStatus.OK);
        }
        @GetMapping("/{farmerId}/agent-contact")
        public ResponseEntity<APIResponse> getMyAgentContact(@PathVariable String farmerId) {
            return new ResponseEntity<>(new APIResponse(true, farmerServices.getMyAgent(farmerId)), HttpStatus.OK);
        }
    }

