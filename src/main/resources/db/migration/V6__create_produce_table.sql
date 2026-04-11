CREATE TABLE produce (
                         produce_id VARCHAR(100) NOT NULL,
                         farmer_id VARCHAR(50) NOT NULL,
                         storage_id VARCHAR(100) NOT NULL,
                         agent_id VARCHAR(50),
                         produce_type VARCHAR(100) NOT NULL,
                         quantity DOUBLE NOT NULL,
                         unit VARCHAR(20) NOT NULL,
                         grade VARCHAR(50),
                         reference_price DOUBLE NOT NULL,
                         status VARCHAR(20) NOT NULL,
                         accrued_storage_cost DOUBLE DEFAULT 0.0,
                         expected_pickup_date DATETIME,
                         logged_at DATETIME,
                         last_storage_cost_update DATETIME,
                         PRIMARY KEY (produce_id)
);