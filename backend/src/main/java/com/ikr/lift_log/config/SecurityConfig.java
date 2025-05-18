package com.ikr.lift_log.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz.anyRequest().permitAll());
        return http.build();
    }

    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {
    // CorsConfiguration configuration = new CorsConfiguration();
    // configuration.setAllowedOrigins(Arrays.asList(
    // "http://localhost:5173", // 開発環境
    // "http://localhost:3000", // 別の開発ポート
    // "http://localhost:8080" // Spring Boot開発サーバー
    // ));
    // configuration.setAllowedMethods(Arrays.asList(
    // "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
    // configuration.setAllowedHeaders(Arrays.asList(
    // "Authorization",
    // "Content-Type",
    // "X-Requested-With",
    // "Accept",
    // "Origin",
    // "Access-Control-Request-Method",
    // "Access-Control-Request-Headers"));
    // configuration.setExposedHeaders(Arrays.asList(
    // "Access-Control-Allow-Origin",
    // "Access-Control-Allow-Credentials"));
    // configuration.setAllowCredentials(true);
    // configuration.setMaxAge(3600L); // プリフライトリクエストのキャッシュ時間（1時間）

    // UrlBasedCorsConfigurationSource source = new
    // UrlBasedCorsConfigurationSource();
    // source.registerCorsConfiguration("/**", configuration);
    // return source;
    // }
}