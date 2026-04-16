package com.agrilink.shared.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class SmsReplyReceivedEvent extends ApplicationEvent {

    private final String phoneNumber;
    private final String reply;

        public SmsReplyReceivedEvent(Object source, String phoneNumber, String reply) {
            super(source);
            this.phoneNumber = phoneNumber;
            this.reply = reply;
        }
}
