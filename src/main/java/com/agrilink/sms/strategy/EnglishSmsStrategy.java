package com.agrilink.sms.strategy;

import com.agrilink.sms.SmsType;
import org.springframework.stereotype.Component;

@Component
public class EnglishSmsStrategy implements SmsStrategy {

    @Override
    public String buildMessage(SmsType smsType, String farmerName, String details) {
        return switch (smsType) {
            case OFFER_RECEIVED -> "Hello " + farmerName + ", a buyer has made an offer on your produce. " + details + ". Reply 1 to accept or 2 to reject.";
            case OFFER_ACCEPTED -> "Hello " + farmerName + ", you have accepted the offer. " + details + ". Please wait for payment confirmation.";
            case OFFER_REJECTED -> "Hello " + farmerName + ", you have rejected the offer. Your produce is available again.";
            case AWAITING_PAYMENT -> "Hello " + farmerName + ", the buyer has been notified to make payment. " + details;
            case PAYMENT_CONFIRMED -> "Hello " + farmerName + ", payment has been confirmed. Logistics will be arranged shortly.";
            case LOGISTICS_ARRANGED -> "Hello " + farmerName + ", logistics have been arranged. " + details;
            case IN_TRANSIT -> "Hello " + farmerName + ", your produce is now in transit to the buyer.";
            case DELIVERED -> "Hello " + farmerName + ", your produce has been delivered. Payout will be processed shortly.";
            case PAYOUT_PROCESSED -> "Hello " + farmerName + ", your payout has been processed. " + details;
            case OFFER_EXPIRED -> "Hello " + farmerName + ", your offer has expired. Your produce is available again.";
            case STORAGE_COST_REMINDER -> "Hello " + farmerName + ", your storage cost reminder. " + details;
            case WITHDRAWAL_PROCESSED -> "Hello " + farmerName + ", your produce withdrawal has been processed. " + details;
        };
    }
}
