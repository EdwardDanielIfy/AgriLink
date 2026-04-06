package com.agrilink.farmer;

import com.agrilink.farmer.dto.FarmerRequest;
import com.agrilink.farmer.dto.FarmerResponse;
import com.agrilink.farmer.dto.FarmerSelfRegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/api/farmers")
    public class FarmerController {

        private final FarmerServices farmerServices;

        public FarmerController(FarmerServices farmerServices) {
            this.farmerServices = farmerServices;
        }

        @PostMapping("/register")
        public ResponseEntity<FarmerResponse> selfRegister(@Valid @RequestBody FarmerSelfRegisterRequest request) {
            return ResponseEntity.status(201)
                    .body(farmerServices.register(request));
        }

        @PostMapping("/login")
        public ResponseEntity<FarmerResponse> login(@RequestParam String phoneNumber, @RequestParam String password) {
            return ResponseEntity.ok(farmerServices.farmerLogin(phoneNumber, password));
        }

        @PutMapping("/{farmerId}/change-password")
        public ResponseEntity<String> changePassword(@PathVariable String farmerId, @RequestParam String oldPassword, @RequestParam String newPassword) {
            farmerServices.changePassword(farmerId, oldPassword, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        }

        @GetMapping("/{farmerId}")
        public ResponseEntity<FarmerResponse> viewProfile(@PathVariable String farmerId) {
            return ResponseEntity.ok(farmerServices.viewProfile(farmerId));
        }

        @PutMapping("/{farmerId}")
        public ResponseEntity<FarmerResponse> updateMyInfo(@PathVariable String farmerId, @Valid @RequestBody FarmerRequest request) {
            return ResponseEntity.ok(farmerServices.updateMyInfo(farmerId, request));
        }

        @GetMapping("/{farmerId}/storage-debt")
        public ResponseEntity<Double> getMyStorageDebt(@PathVariable String farmerId) {
            return ResponseEntity.ok(farmerServices.viewStorageDebt(farmerId));
        }

        @GetMapping("/{farmerId}/agent-contact")
        public ResponseEntity<String> getMyAgentContact(@PathVariable String farmerId) {
            return ResponseEntity.ok(farmerServices.getMyAgentContact(farmerId));
        }
    }

