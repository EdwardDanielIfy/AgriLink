package com.agrilink.sms.listener;

import com.agrilink.shared.events.TransactionStatusChangedEvent;
import com.agrilink.sms.SmsServices;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionEventListener {

    private final SmsServices smsServices;

    @Async("smsTaskExecutor")
    @EventListener
    public void handleTransactionStatusChanged(TransactionStatusChangedEvent event) {
        smsServices.sendTransactionSms(
                event.getTransactionId(),
                event.getNewStatus()
        );
    }
}