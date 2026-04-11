package com.agrilink.transaction;

public enum TransactionStatus {
    LISTED,
    OFFER_MADE,
    AWAITING_RESPONSE,
    ACCEPTED,
    REJECTED,
    AWAITING_PAYMENT,
    PAYMENT_CONFIRMED,
    LOGISTICS_ARRANGED,
    IN_TRANSIT,
    DELIVERED,
    PAYOUT_PROCESSING,
    COMPLETE,
    EXPIRED,
    DISPUTED
}
