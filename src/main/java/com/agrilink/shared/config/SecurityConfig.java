package com.agrilink.shared.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // public endpoints — no token needed
                        .requestMatchers(
                                "/api/farmers/register",
                                "/api/farmers/login",
                                "/api/agents/login",
                                "/api/buyers/register",
                                "/api/buyers/login",
                                "/api/admin/login",
                                "/api/sms/reply",
                                "/api/marketplace/listings/**",
                                "/api/payments/webhook",
                                "/api/payments/banks"
                        ).permitAll()
                        // agent only
                        .requestMatchers("/api/agents/**").hasRole("AGENT")
                        // farmer only
                        .requestMatchers("/api/farmers/**").hasRole("FARMER")
                        // buyer only
                        .requestMatchers("/api/buyers/**").hasRole("BUYER")

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // everything else needs authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}