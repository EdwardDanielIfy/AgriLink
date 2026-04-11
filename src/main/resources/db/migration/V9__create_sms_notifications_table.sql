CREATE TABLE sms_notifications (
                                   id VARCHAR(50) NOT NULL,
                                   recipient_phone VARCHAR(20) NOT NULL,
                                   farmer_id VARCHAR(50),
                                   transaction_id VARCHAR(100),
                                   sms_type VARCHAR(50) NOT NULL,
                                   message VARCHAR(500) NOT NULL,
                                   delivered BOOLEAN NOT NULL DEFAULT FALSE,
                                   failure_reason VARCHAR(255),
                                   sent_at DATETIME,
                                   PRIMARY KEY (id)
);