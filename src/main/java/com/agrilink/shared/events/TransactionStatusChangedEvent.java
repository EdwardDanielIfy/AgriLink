package com.agrilink.shared.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;


@Getter
public class TransactionStatusChangedEvent extends ApplicationEvent {

    private final String transactionId;
    private final String newStatus;

    public TransactionStatusChangedEvent(Object source, String transactionId, String newStatus) {
        super(source);
        this.transactionId = transactionId;
        this.newStatus = newStatus;
    }

}