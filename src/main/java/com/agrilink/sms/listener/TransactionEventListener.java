package com.agrilink.sms.listener;

import com.agrilink.shared.events.TransactionStatusChangedEvent;
import com.agrilink.sms.SmsServices;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventListener {

    private final SmsServices smsServices;

    @Async("smsTaskExecutor")
    @EventListener
    public void handleTransactionStatusChanged(TransactionStatusChangedEvent event) {
        log.info("Processing status change SMS for Transaction {}: Status {}", 
                event.getTransactionId(), event.getNewStatus());
        smsServices.sendTransactionSms(
                event.getTransactionId(),
                event.getNewStatus()
        );
    }
}