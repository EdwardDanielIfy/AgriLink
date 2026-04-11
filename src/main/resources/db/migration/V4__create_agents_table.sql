CREATE TABLE agents (
                        agent_id VARCHAR(50) NOT NULL,
                        full_name VARCHAR(100) NOT NULL,
                        phone_number VARCHAR(20) NOT NULL UNIQUE,
                        email VARCHAR(100) UNIQUE,
                        territory VARCHAR(100),
                        password VARCHAR(255) NOT NULL,
                        registered_at DATETIME,
                        PRIMARY KEY (agent_id)
);