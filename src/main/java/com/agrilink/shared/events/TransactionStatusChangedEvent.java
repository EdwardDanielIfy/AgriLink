package com.agrilink.shared.events;

import com.agrilink.transaction.TransactionStatus;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;


@Getter
public class TransactionStatusChangedEvent extends ApplicationEvent {

    private final String transactionId;
    private final TransactionStatus newStatus;

    public TransactionStatusChangedEvent(Object source, String transactionId, TransactionStatus newStatus) {
        super(source);
        this.transactionId = transactionId;
        this.newStatus = newStatus;
    }

}