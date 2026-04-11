package com.agrilink.sms;

import com.agrilink.shared.APIResponse;
import com.agrilink.transaction.TransactionServices;
import com.agrilink.transaction.TransactionStatus;
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

    // ─── AFRICA'S TALKING WEBHOOK ─────────────────────────────────────

    @PostMapping("/reply")
    public ResponseEntity<String> handleSmsReply(
            @RequestParam String from,
            @RequestParam String text,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String date) {

        log.info("SMS reply received from: {} text: {}", from, text);

        try {
            String trimmed = text.trim();

            // find the most recent AWAITING_RESPONSE transaction for this farmer
            String transactionId = transactionServices
                    .findAwaitingResponseTransactionByPhone(from);

            if (transactionId == null) {
                log.warn("No awaiting transaction found for phone: {}", from);
                return ResponseEntity.ok("OK");
            }

            if (trimmed.equals("1")) {
                transactionServices.acceptOffer(transactionId);
            } else if (trimmed.equals("2")) {
                transactionServices.rejectOffer(transactionId);
            } else {
                log.warn("Unrecognized reply '{}' from {}", trimmed, from);
            }

        } catch (Exception e) {
            log.error("Error processing SMS reply from {}: {}", from, e.getMessage());
        }

        // Africa's Talking expects a 200 OK response
        return ResponseEntity.ok("OK");
    }

    // ─── SMS HISTORY ──────────────────────────────────────────────────

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<APIResponse> getSmsHistoryByFarmer(
            @PathVariable String farmerId) {
        return new ResponseEntity<>(
                new APIResponse(true, smsServices.getSmsHistoryByFarmer(farmerId)),
                HttpStatus.OK
        );
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<APIResponse> getSmsHistoryByTransaction(
            @PathVariable String transactionId) {
        return new ResponseEntity<>(
                new APIResponse(true, smsServices.getSmsHistoryByTransaction(transactionId)),
                HttpStatus.OK
        );
    }
}
