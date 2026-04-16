package com.agrilink.payment.dto;

import lombok.Data;

@Data
public class PaymentInitializeResponse {

    private String transactionId;
    private String authorizationUrl;
    private String reference;
    private String status;
}