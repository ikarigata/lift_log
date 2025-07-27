package com.ikr.lift_log.config;

import com.ikr.lift_log.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(authz -> authz
                                                // ログインエンドポイントは認証不要
                                                .requestMatchers("/api/v1/login").permitAll()
                                                // その他のAPIエンドポイントは認証必要
                                                .requestMatchers("/api/**").authenticated()
                                                // その他のリクエストは許可（静的リソースなど）
                                                .anyRequest().permitAll())
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Arrays.asList(
                                "http://localhost:3000", // フロントエンド開発サーバー (Vite)
                                "http://localhost:5173", // フロントエンド開発サーバー (Vite default)
                                "http://localhost:8080"  // 同一ポートからのリクエスト
                ));
                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
                configuration.setAllowedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type",
                                "X-Requested-With",
                                "Accept",
                                "Origin",
                                "Access-Control-Request-Method",
                                "Access-Control-Request-Headers"));
                configuration.setExposedHeaders(Arrays.asList(
                                "Access-Control-Allow-Origin",
                                "Access-Control-Allow-Credentials"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L); // プリフライトリクエストのキャッシュ時間（1時間）

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}