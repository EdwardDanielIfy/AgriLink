package com.agrilink.sms;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SmsNotificationRepository extends JpaRepository<SmsNotification, String> {

    List<SmsNotification> findByFarmerId(String farmerId);

    List<SmsNotification> findByTransactionId(String transactionId);

    List<SmsNotification> findByDeliveredFalse();

    List<SmsNotification> findBySmsType(SmsType smsType);
}
