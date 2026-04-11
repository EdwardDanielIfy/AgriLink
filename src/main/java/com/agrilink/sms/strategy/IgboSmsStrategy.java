package com.agrilink.sms.strategy;

import com.agrilink.sms.SmsType;
import org.springframework.stereotype.Component;

@Component
public class IgboSmsStrategy implements SmsStrategy {

    @Override
    public String buildMessage(SmsType smsType, String farmerName, String details) {
        return switch (smsType) {
            case OFFER_RECEIVED -> "Ndewo " + farmerName + ", onye ọzụ achọrọ ịzụta ihe ọ̀kụkụ gị. " + details + ". Zaa 1 iji nakọ ma ọ bụ 2 iji jụ.";
            case OFFER_ACCEPTED -> "Ndewo " + farmerName + ", ị nakọtara ọ̀tụtụ ahịa. " + details + ". Biko chere nkwenye nke ịkwụ ụgwọ.";
            case OFFER_REJECTED -> "Ndewo " + farmerName + ", ị jụrụ ọ̀tụtụ ahịa. Ihe ọ̀kụkụ gị dị ready maka ahịa ọzọ.";
            case AWAITING_PAYMENT -> "Ndewo " + farmerName + ", a gwaara onye ọzụ ka ọ kwụọ ụgwọ. " + details;
            case PAYMENT_CONFIRMED -> "Ndewo " + farmerName + ", e nwetara nkwenye nke ịkwụ ụgwọ. A ga-ahazi njem n'oge na-adịghị anya.";
            case LOGISTICS_ARRANGED -> "Ndewo " + farmerName + ", ahaziri njem. " + details;
            case IN_TRANSIT -> "Ndewo " + farmerName + ", ihe ọ̀kụkụ gị na-aga n'ụzọ gaa n'aka onye ọzụ.";
            case DELIVERED -> "Ndewo " + farmerName + ", enyerela onye ọzụ ihe ọ̀kụkụ gị. A ga-akwụ gị ụgwọ n'oge na-adịghị anya.";
            case PAYOUT_PROCESSED -> "Ndewo " + farmerName + ", akwụọla gị ụgwọ. " + details;
            case OFFER_EXPIRED -> "Ndewo " + farmerName + ", ọ̀tụtụ ahịa agwụla. Ihe ọ̀kụkụ gị dị ready maka ahịa ọzọ.";
            case STORAGE_COST_REMINDER -> "Ndewo " + farmerName + ", ihe ọzọ banyere ụgwọ nchekwa. " + details;
            case WITHDRAWAL_PROCESSED -> "Ndewo " + farmerName + ", emechara iwepụ ihe ọ̀kụkụ gị. " + details;
        };
    }
}