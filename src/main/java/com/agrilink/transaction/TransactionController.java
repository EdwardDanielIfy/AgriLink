package com.agrilink.transaction;

import com.agrilink.shared.APIResponse;
import com.agrilink.transaction.dto.TransactionRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionServices transactionServices;

    @PostMapping("/offer")
    public ResponseEntity<APIResponse> makeOffer(@Valid @RequestBody TransactionRequest request) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.makeOffer(request)), HttpStatus.CREATED);
    }

    @PutMapping("/{transactionId}/confirm-delivery")
    public ResponseEntity<APIResponse> confirmDelivery(@PathVariable String transactionId) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.confirmDelivery(transactionId)), HttpStatus.OK);
    }

    @PutMapping("/{transactionId}/accept")
    public ResponseEntity<APIResponse> acceptOffer(@PathVariable String transactionId) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.acceptOffer(transactionId)), HttpStatus.OK);
    }

    @PutMapping("/{transactionId}/reject")
    public ResponseEntity<APIResponse> rejectOffer(@PathVariable String transactionId) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.rejectOffer(transactionId)), HttpStatus.OK);
    }

    @PutMapping("/{transactionId}/confirm-payment")
    public ResponseEntity<APIResponse> confirmPayment(@PathVariable String transactionId, @RequestParam String paymentReference) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.confirmPayment(transactionId, paymentReference)), HttpStatus.OK);
    }

       @PutMapping("/{transactionId}/arrange-logistics")
    public ResponseEntity<APIResponse> arrangeLogistics(@PathVariable String transactionId, @RequestParam String logisticsPartner, @RequestParam String trackingNumber) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.arrangeLogistics(transactionId, logisticsPartner, trackingNumber)), HttpStatus.OK);
    }

    @PutMapping("/{transactionId}/mark-in-transit")
    public ResponseEntity<APIResponse> markInTransit(@PathVariable String transactionId) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.markInTransit(transactionId)), HttpStatus.OK);
    }

    @PutMapping("/{transactionId}/process-payout")
    public ResponseEntity<APIResponse> processPayout(@PathVariable String transactionId) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.processPayout(transactionId)), HttpStatus.OK);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<APIResponse> getTransactionById(@PathVariable String transactionId) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.getTransactionById(transactionId)), HttpStatus.OK);
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<APIResponse> getTransactionsByFarmer(@PathVariable String farmerId) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.getTransactionsByFarmer(farmerId)), HttpStatus.OK);
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<APIResponse> getTransactionsByBuyer(@PathVariable String buyerId) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.getTransactionsByBuyer(buyerId)), HttpStatus.OK);
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<APIResponse> getTransactionsByAgent(@PathVariable String agentId) {
        return new ResponseEntity<>(new APIResponse(true, transactionServices.getTransactionsByAgent(agentId)), HttpStatus.OK);
    }
}