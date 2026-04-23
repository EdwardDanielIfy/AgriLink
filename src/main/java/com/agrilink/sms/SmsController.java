package com.agrilink.sms;

import com.agrilink.shared.APIResponse;
import com.agrilink.transaction.TransactionServices;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/sms")
@RequiredArgsConstructor
public class SmsController {

    private final TransactionServices transactionServices;
    private final SmsServices smsServices;

    @PostMapping("/reply")
    public ResponseEntity<String> handleSmsReply(@RequestParam String from, @RequestParam String text, @RequestParam(required = false) String to, @RequestParam(required = false) String date) {
        smsServices.handleFarmerReply(from, text);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<APIResponse> getSmsHistoryByFarmer(@PathVariable String farmerId) {
        return new ResponseEntity<>(new APIResponse(true, smsServices.getSmsHistoryByFarmer(farmerId)), HttpStatus.OK);
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<APIResponse> getSmsHistoryByTransaction(@PathVariable String transactionId) {
        return new ResponseEntity<>(new APIResponse(true, smsServices.getSmsHistoryByTransaction(transactionId)), HttpStatus.OK);
    }
}