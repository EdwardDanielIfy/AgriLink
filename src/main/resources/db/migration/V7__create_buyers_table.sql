CREATE TABLE buyers (
                        buyer_id VARCHAR(50) NOT NULL,
                        full_name VARCHAR(100) NOT NULL,
                        phone_number VARCHAR(20) NOT NULL UNIQUE,
                        email VARCHAR(100) UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        business_name VARCHAR(100),
                        location VARCHAR(100),
                        registered_at DATETIME,
                        PRIMARY KEY (buyer_id)
);