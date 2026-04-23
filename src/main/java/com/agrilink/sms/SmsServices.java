package com.agrilink.sms;

import com.africastalking.AfricasTalking;
import com.africastalking.SmsService;
import com.agrilink.farmer.Farmer;
import com.agrilink.farmer.FarmerServices;
import com.agrilink.produce.Produce;
import com.agrilink.produce.ProduceServices;
import com.agrilink.shared.enums.Language;
import com.agrilink.shared.events.SmsReplyReceivedEvent;
import com.agrilink.sms.strategy.*;
import com.agrilink.transaction.Transaction;
import com.agrilink.transaction.TransactionServices;
import com.agrilink.transaction.TransactionStatus;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsServices {

    private final SmsNotificationRepository smsNotificationRepository;
    private final FarmerServices farmerServices;
    private final TransactionServices transactionServices;
    private final EnglishSmsStrategy englishSmsStrategy;
    private final HausaSmsStrategy hausaSmsStrategy;
    private final YorubaSmsStrategy yorubaSmsStrategy;
    private final IgboSmsStrategy igboSmsStrategy;
    private final ProduceServices  produceServices;
    private final ApplicationEventPublisher eventPublisher;

    @Value("${africastalking.username}")
    private String username;

    @Value("${africastalking.api-key}")
    private String apiKey;

    @Value("${africastalking.sender-id}")
    private String senderId;

    private SmsService smsService;

    @PostConstruct
    public void init() {
        AfricasTalking.initialize(username, apiKey);
        smsService = AfricasTalking.getService(AfricasTalking.SERVICE_SMS);
        log.info("Africa's Talking SMS service initialized for username: {}", username);
    }

    public void sendTransactionSms(String transactionId, TransactionStatus status) {
        try {
            Transaction transaction = transactionServices.findById(transactionId);
            Farmer farmer = farmerServices.findById(transaction.getFarmerId());

            SmsType smsType = mapStatusToSmsType(status);
            if (smsType == null) {
                log.info("No SMS needed for status: {}", status);
                return;
            }

            String details = buildDetails(transaction, smsType);
            SmsStrategy strategy = getStrategy(farmer.getPreferredLanguage());
            String message = strategy.buildMessage(smsType, farmer.getFullName(), details);

            sendSms(farmer.getPhoneNumber(), message, smsType,
                    farmer.getFarmerId(), transactionId);

        } catch (Exception e) {
            log.error("Failed to send transaction SMS for transactionId: {}", transactionId, e);
        }
    }


    public void sendDirectSms(String phoneNumber, String message, SmsType smsType, String farmerId) {
        sendSms(phoneNumber, message, smsType, farmerId, null);
    }

    public List<SmsNotification> getSmsHistoryByFarmer(String farmerId) {
        return smsNotificationRepository.findByFarmerId(farmerId);
    }

    public List<SmsNotification> getSmsHistoryByTransaction(String transactionId) {
        return smsNotificationRepository.findByTransactionId(transactionId);
    }

    private void sendSms(String phoneNumber, String message, SmsType smsType, String farmerId, String transactionId) {

        if (username == null || username.startsWith("${") || apiKey == null || apiKey.startsWith("${")) {
            log.error("SMS credentials not initialized! Check AFRICASTALKING_USERNAME and AFRICASTALKING_API_KEY env vars.");
            return;
        }

        SmsNotification notification = new SmsNotification();
        notification.setRecipientPhone(phoneNumber);
        notification.setMessage(message);
        notification.setSmsType(smsType);
        notification.setFarmerId(farmerId);
        notification.setTransactionId(transactionId);
        notification.setDelivered(false);

        try {
            String targetPhone = phoneNumber;
            if (!targetPhone.startsWith("+")) {
                if (targetPhone.startsWith("234")) {
                    targetPhone = "+" + targetPhone;
                } else if (targetPhone.startsWith("0")) {
                    targetPhone = "+234" + targetPhone.substring(1);
                } else {
                    targetPhone = "+234" + targetPhone; // Assume Nigeria
                }
            }

            log.info("Attempting to send SMS to {}: {}", targetPhone, message);
            
            if (senderId != null && !senderId.isEmpty() && !senderId.startsWith("${")) {
                smsService.send(message, senderId, new String[]{targetPhone}, false);
            } else {
                smsService.send(message, new String[]{targetPhone}, false);
            }

            notification.setDelivered(true);
            log.info("SMS request submitted successfully to Africa's Talking for {}", targetPhone);

        } catch (Exception e) {
            notification.setDelivered(false);
            notification.setFailureReason(e.getMessage());
            log.error("SMS delivery failed to {}. Error: {}", phoneNumber, e.getMessage());
            e.printStackTrace();

        } finally {
            try {
                smsNotificationRepository.save(notification);
            } catch (Exception ex) {
                log.error("Failed to save SMS notification log: {}", ex.getMessage());
            }
        }
    }

    private SmsType mapStatusToSmsType(TransactionStatus status) {
        return switch (status) {
            case OFFER_MADE -> SmsType.OFFER_RECEIVED;
            case ACCEPTED -> SmsType.OFFER_ACCEPTED;
            case REJECTED -> SmsType.OFFER_REJECTED;
            case AWAITING_PAYMENT -> SmsType.AWAITING_PAYMENT;
            case PAYMENT_CONFIRMED -> SmsType.PAYMENT_CONFIRMED;
            case LOGISTICS_ARRANGED -> SmsType.LOGISTICS_ARRANGED;
            case IN_TRANSIT -> SmsType.IN_TRANSIT;
            case DELIVERED -> SmsType.DELIVERED;
            case COMPLETE -> SmsType.PAYOUT_PROCESSED;
            case EXPIRED -> SmsType.OFFER_EXPIRED;
            default -> null;
        };
    }

private String buildDetails(Transaction transaction, SmsType smsType) {
    return switch (smsType) {
        case OFFER_RECEIVED -> {
            Produce produce = produceServices.findById(transaction.getProduceId());
            yield "Produce: " + produce.getProduceType() + ", Quantity: " + transaction.getQuantitySold() + " " + produce.getUnit()
                    + ", Offered price: NGN " + transaction.getOfferedPrice();
        }
        case PAYOUT_PROCESSED -> "Net payout: NGN " + transaction.getFarmerNetPayout()
                + " after NGN " + transaction.getCommissionAmount() + " commission"
                + " and NGN " + transaction.getStorageCostDeducted() + " storage cost";
        case LOGISTICS_ARRANGED -> "Logistics partner: " + transaction.getLogisticsPartner()
                + ". Tracking: " + transaction.getLogisticsTrackingNumber();
        default -> "";
    };
}

    private SmsStrategy getStrategy(Language language) {
        if (language == null) return englishSmsStrategy;
        return switch (language) {
            case HAUSA -> hausaSmsStrategy;
            case YORUBA -> yorubaSmsStrategy;
            case IGBO -> igboSmsStrategy;
            default -> englishSmsStrategy;
        };
    }

    public void handleFarmerReply(String from, String text) {
        log.info("SMS reply received from: {} text: {}", from, text);

        try {
            String trimmed = text.trim();

            if (!trimmed.equals("1") && !trimmed.equals("2")) {
                log.warn("Unrecognized reply '{}' from {}", trimmed, from);
                return;
            }

            String normalizedPhone = normalizePhone(from);

            eventPublisher.publishEvent(
                    new SmsReplyReceivedEvent(this, normalizedPhone, trimmed)
            );

        } catch (Exception e) {
            log.error("Error processing SMS reply from {}: {}", from, e.getMessage());
        }
    }

    private String normalizePhone(String from) {
        if (from.startsWith("+")) {
            return from.substring(1);
        }
        return from;
    }
}