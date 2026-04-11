package com.agrilink.sms.strategy;

import com.agrilink.sms.SmsType;
import org.springframework.stereotype.Component;

@Component
public class HausaSmsStrategy implements SmsStrategy {

    @Override
    public String buildMessage(SmsType smsType, String farmerName, String details) {
        return switch (smsType) {
            case OFFER_RECEIVED -> "Sannu " + farmerName + ", mai siye ya yi maka tayin siyan kayan gonarku. " + details + ". Amsa 1 don yarda ko 2 don ƙi.";
            case OFFER_ACCEPTED -> "Sannu " + farmerName + ", kun yarda da tayin. " + details + ". Don Allah ku jira tabbacin biyan kuɗi.";
            case OFFER_REJECTED -> "Sannu " + farmerName + ", kun ƙi tayin. Kayan gonarku na samuwa a kasuwa.";
            case AWAITING_PAYMENT -> "Sannu " + farmerName + ", an sanar da mai siye don biyan kuɗi. " + details;
            case PAYMENT_CONFIRMED -> "Sannu " + farmerName + ", an tabbatar da biyan kuɗi. Za a shirya jigilar kaya nan ba da jimawa ba.";
            case LOGISTICS_ARRANGED -> "Sannu " + farmerName + ", an shirya jigilar kaya. " + details;
            case IN_TRANSIT -> "Sannu " + farmerName + ", ana jigilar kayan gonarku zuwa wurin mai siye.";
            case DELIVERED -> "Sannu " + farmerName + ", an isar da kayan gonarku. Za a biya ku nan ba da jimawa ba.";
            case PAYOUT_PROCESSED -> "Sannu " + farmerName + ", an aika kuɗin ku. " + details;
            case OFFER_EXPIRED -> "Sannu " + farmerName + ", tayin ya ƙare. Kayan gonarku na samuwa a kasuwa.";
            case STORAGE_COST_REMINDER -> "Sannu " + farmerName + ", tunatarwa game da kuɗin ajiya. " + details;
            case WITHDRAWAL_PROCESSED -> "Sannu " + farmerName + ", an sarrafa ficewa kayan gonarku. " + details;
        };
    }
}