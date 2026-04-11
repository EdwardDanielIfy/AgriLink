CREATE TABLE storage_facilities (

         storage_id VARCHAR(100) NOT NULL,
         name VARCHAR(100) NOT NULL,
         location VARCHAR(100) NOT NULL,
         territory VARCHAR(100),
         partner_name VARCHAR(100) NOT NULL,
         partner_facility_id VARCHAR(100),
         contact_phone VARCHAR(20),
         capacity INT NOT NULL,
         cost_per_day DOUBLE NOT NULL,
         managed_by_agent_id VARCHAR(50),
         created_at DATETIME,
         PRIMARY KEY (storage_id)
);