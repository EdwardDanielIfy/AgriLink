package com.agrilink.sms.strategy;

import com.agrilink.sms.SmsType;
import org.springframework.stereotype.Component;

@Component
public class YorubaSmsStrategy implements SmsStrategy {

    @Override
    public String buildMessage(SmsType smsType, String farmerName, String details) {
        return switch (smsType) {
            case OFFER_RECEIVED -> "Ẹ káàbọ̀ " + farmerName + ", olùrà kan ti ṣe àfihàn ìfẹ́ láti ra ohun ọ̀gbìn rẹ. " + details + ". Dáhùn 1 láti gba tàbí 2 láti kọ.";
            case OFFER_ACCEPTED -> "Ẹ káàbọ̀ " + farmerName + ", ẹ ti gba ìfẹ́ náà. " + details + ". Jọ̀wọ́ dúró de ìmúdájú ìsanwó.";
            case OFFER_REJECTED -> "Ẹ káàbọ̀ " + farmerName + ", ẹ ti kọ ìfẹ́ náà. Ohun ọ̀gbìn rẹ wà fún tìtà lẹ́ẹ̀kan sí.";
            case AWAITING_PAYMENT -> "Ẹ káàbọ̀ " + farmerName + ", a ti sọ fún olùrà láti san owó. " + details;
            case PAYMENT_CONFIRMED -> "Ẹ káàbọ̀ " + farmerName + ", ìsanwó ti jẹ ìmúdájú. A óò ṣètò gbígbe laipẹ.";
            case LOGISTICS_ARRANGED -> "Ẹ káàbọ̀ " + farmerName + ", a ti ṣètò gbígbe. " + details;
            case IN_TRANSIT -> "Ẹ káàbọ̀ " + farmerName + ", ohun ọ̀gbìn rẹ wà lọ́nà sí ọ̀dọ̀ olùrà.";
            case DELIVERED -> "Ẹ káàbọ̀ " + farmerName + ", a ti fi ohun ọ̀gbìn rẹ lé olùrà lọ́wọ́. A óò san owó rẹ laipẹ.";
            case PAYOUT_PROCESSED -> "Ẹ káàbọ̀ " + farmerName + ", a ti san owó rẹ. " + details;
            case OFFER_EXPIRED -> "Ẹ káàbọ̀ " + farmerName + ", ìfẹ́ náà ti parí. Ohun ọ̀gbìn rẹ wà fún tìtà lẹ́ẹ̀kan sí.";
            case STORAGE_COST_REMINDER -> "Ẹ káàbọ̀ " + farmerName + ", ìránlọ́wọ́ nípa owó ìpamọ́. " + details;
            case WITHDRAWAL_PROCESSED -> "Ẹ káàbọ̀ " + farmerName + ", a ti ṣe àgbékalẹ̀ yiyọ ohun ọ̀gbìn rẹ. " + details;
        };
    }
}