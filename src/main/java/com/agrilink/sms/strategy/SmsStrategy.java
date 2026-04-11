package com.agrilink.sms.strategy;

import com.agrilink.sms.SmsType;

public interface SmsStrategy {
    String buildMessage(SmsType smsType, String farmerName, String details);
}
