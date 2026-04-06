CREATE TABLE farmers (
        farmer_id VARCHAR(50) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL UNIQUE,
        location VARCHAR(100),
        primary_crop VARCHAR(100),
        preferred_language VARCHAR(10),
        storage_debt DOUBLE DEFAULT 0.0,
        password VARCHAR(255),
        has_app_access BOOLEAN DEFAULT FALSE,
        registered_by_agent_id VARCHAR(50),
        registered_at DATETIME,
        PRIMARY KEY (farmer_id)
);