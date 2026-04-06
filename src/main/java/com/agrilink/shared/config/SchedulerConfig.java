package com.agrilink.shared.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

    @Configuration
    @EnableScheduling
    public class SchedulerConfig {
        // enabling @Scheduled across the app
        // actual scheduled methods live in their own modules
    }

