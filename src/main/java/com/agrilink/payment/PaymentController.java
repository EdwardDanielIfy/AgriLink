package com.agrilink.payment;

import com.agrilink.shared.APIResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentServices paymentServices;

    @PostMapping("/initialize/{transactionId}")
    public ResponseEntity<APIResponse> initializePayment(
            @PathVariable String transactionId) {
        return new ResponseEntity<>(
                new APIResponse(true, paymentServices.initializePayment(transactionId)),
                HttpStatus.OK
        );
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(HttpServletRequest request) throws IOException {
        String payload = new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        String signature = request.getHeader("x-paystack-signature");
        paymentServices.handleWebhook(payload, signature);
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/payout/{transactionId}")
    public ResponseEntity<APIResponse> processFarmerPayout(
            @PathVariable String transactionId) {
        paymentServices.processFarmerPayout(transactionId);
        return new ResponseEntity<>(
                new APIResponse(true, "Payout processed successfully"),
                HttpStatus.OK
        );
    }

    @GetMapping("/banks")
    public ResponseEntity<APIResponse> getAvailableBanks() {
        return new ResponseEntity<>(
                new APIResponse(true, paymentServices.getAvailableBanks()),
                HttpStatus.OK
        );
    }
}