package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.LoginRequest;
import com.ikr.lift_log.controller.dto.LoginResponse;
import com.ikr.lift_log.util.TestUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureTestRestTemplate
@Transactional
public class AuthControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testLogin_Success() {
        // テストデータが既にDBに存在する想定（test@example.com / password）
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");
        
        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                "/api/v1/login", 
                loginRequest, 
                LoginResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isNotNull();
        assertThat(response.getBody().getUser().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    public void testLogin_InvalidCredentials() {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "wrongpassword");
        
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/v1/login", 
                loginRequest, 
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void testLogin_ValidationError_EmptyEmail() {
        LoginRequest loginRequest = new LoginRequest("", "password");
        
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/v1/login", 
                loginRequest, 
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testLogin_ValidationError_InvalidEmail() {
        LoginRequest loginRequest = new LoginRequest("invalid-email", "password");
        
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/v1/login", 
                loginRequest, 
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testLogin_ValidationError_EmptyPassword() {
        LoginRequest loginRequest = new LoginRequest("test@example.com", "");
        
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/v1/login", 
                loginRequest, 
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}