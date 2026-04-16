package com.agrilink.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PaystackWebhookEvent {

    private String event;

    private EventData data;

    @Data
    public static class EventData {

        private String reference;
        private String status;
        private Long amount;

        @JsonProperty("paid_at")
        private String paidAt;

        @JsonProperty("customer")
        private Customer customer;

        @Data
        public static class Customer {
            private String email;

            @JsonProperty("phone")
            private String phone;
        }
    }
}