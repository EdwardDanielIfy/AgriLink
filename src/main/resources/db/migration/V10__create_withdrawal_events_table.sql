CREATE TABLE withdrawal_events (
                                   withdrawal_id VARCHAR(50) NOT NULL,
                                   produce_id VARCHAR(100) NOT NULL,
                                   farmer_id VARCHAR(50) NOT NULL,
                                   agent_id VARCHAR(50) NOT NULL,
                                   storage_cost_at_withdrawal DOUBLE,
                                   reason VARCHAR(255),
                                   withdrawn_at DATETIME,
                                   PRIMARY KEY (withdrawal_id)
);