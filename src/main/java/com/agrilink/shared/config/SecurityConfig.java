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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of(
                                "http://localhost:5173", // Vite dev server
                                "http://localhost:3000" // fallback
                ));
                configuration.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);
                return new UrlBasedCorsConfigurationSource() {
                        {
                                registerCorsConfiguration("/**", configuration);
                        }
                };
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/farmers/register",
                                                                "/api/farmers/login",
                                                                "/api/agents/login",
                                                                "/api/buyers/register",
                                                                "/api/buyers/login",
                                                                "/api/admin/login",
                                                                "/api/sms/reply",
                                                                "/api/marketplace/raw",
                                                                "/api/marketplace/listings/**",
                                                                "/api/payments/webhook",
                                                                "/api/payments/banks",
                                                                "/error")
                                                .permitAll()
                                                // agent only
                                                .requestMatchers("/api/agents/**").hasRole("AGENT")
                                                // farmer only
                                                .requestMatchers("/api/farmers/**").hasRole("FARMER")
                                                // buyer only
                                                .requestMatchers("/api/buyers/**").hasRole("BUYER")

                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                // everything else needs authentication
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}