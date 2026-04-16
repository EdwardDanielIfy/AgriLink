package com.agrilink.transaction;

import com.agrilink.shared.events.SmsReplyReceivedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SmsReplyEventListener {

    private final TransactionServices transactionServices;

    @EventListener
    public void handleSmsReply(SmsReplyReceivedEvent event) {
        try {
            String transactionId = transactionServices
                    .findAwaitingResponseTransactionByPhone(event.getPhoneNumber());

            if (transactionId == null) {
                log.warn("No awaiting transaction found for phone: {}",
                        event.getPhoneNumber());
                return;
            }

            if (event.getReply().equals("1")) {
                transactionServices.acceptOffer(transactionId);
            } else if (event.getReply().equals("2")) {
                transactionServices.rejectOffer(transactionId);
            }

        } catch (Exception e) {
            log.error("Error handling SMS reply for phone: {}",
                    event.getPhoneNumber(), e);
        }
    }

    private String findTransaction(String phone) {
        // try as received
        String txId = transactionServices
                .findAwaitingResponseTransactionByPhone(phone);
        if (txId != null) return txId;

        // try local format
        if (phone.startsWith("234")) {
            txId = transactionServices
                    .findAwaitingResponseTransactionByPhone("0" + phone.substring(3));
        }
        return txId;
    }
}