package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.LoginRequest;
import com.ikr.lift_log.controller.dto.LoginResponse;
import com.ikr.lift_log.controller.dto.ExerciseRequest;
import com.ikr.lift_log.controller.dto.ExerciseResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureTestRestTemplate
@Transactional
public class ExerciseControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    private String authToken;
    private HttpHeaders headers;

    @BeforeEach
    public void setUp() {
        // ログインしてJWTトークンを取得
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");
        ResponseEntity<LoginResponse> loginResponse = restTemplate.postForEntity(
                "/api/v1/login", 
                loginRequest, 
                LoginResponse.class
        );
        
        authToken = loginResponse.getBody().getToken();
        headers = new HttpHeaders();
        headers.setBearerAuth(authToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    @Test
    public void testGetAllExercises_Success() {
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<List<ExerciseResponse>> response = restTemplate.exchange(
                "/api/v1/exercises",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<ExerciseResponse>>() {}
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        // テストデータが存在することを確認
        assertThat(response.getBody()).hasSizeGreaterThan(0);
    }

    @Test
    public void testGetExerciseById_Success() {
        // まず全エクササイズを取得して既存のIDを使用
        HttpEntity<Void> getAllEntity = new HttpEntity<>(headers);
        ResponseEntity<List<ExerciseResponse>> getAllResponse = restTemplate.exchange(
                "/api/v1/exercises",
                HttpMethod.GET,
                getAllEntity,
                new ParameterizedTypeReference<List<ExerciseResponse>>() {}
        );
        
        assertThat(getAllResponse.getBody()).isNotEmpty();
        UUID exerciseId = getAllResponse.getBody().get(0).getId();
        
        // IDで個別取得
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<ExerciseResponse> response = restTemplate.exchange(
                "/api/v1/exercises/" + exerciseId,
                HttpMethod.GET,
                entity,
                ExerciseResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(exerciseId);
    }

    @Test
    public void testGetExerciseById_NotFound() {
        UUID nonExistentId = UUID.randomUUID();
        
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/exercises/" + nonExistentId,
                HttpMethod.GET,
                entity,
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testCreateExercise_Success() {
        ExerciseRequest request = new ExerciseRequest("テストメニュー", UUID.randomUUID());
        HttpEntity<ExerciseRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<ExerciseResponse> response = restTemplate.exchange(
                "/api/v1/exercises",
                HttpMethod.POST,
                entity,
                ExerciseResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("テストメニュー");
        assertThat(response.getBody().getId()).isNotNull();
    }

    @Test
    public void testUpdateExercise_Success() {
        // まずエクササイズを作成
        ExerciseRequest createRequest = new ExerciseRequest("元のメニュー", UUID.randomUUID());
        HttpEntity<ExerciseRequest> createEntity = new HttpEntity<>(createRequest, headers);
        ResponseEntity<ExerciseResponse> createResponse = restTemplate.exchange(
                "/api/v1/exercises",
                HttpMethod.POST,
                createEntity,
                ExerciseResponse.class
        );
        
        UUID exerciseId = createResponse.getBody().getId();
        
        // 更新
        ExerciseRequest updateRequest = new ExerciseRequest("更新されたメニュー", UUID.randomUUID());
        HttpEntity<ExerciseRequest> updateEntity = new HttpEntity<>(updateRequest, headers);
        ResponseEntity<ExerciseResponse> response = restTemplate.exchange(
                "/api/v1/exercises/" + exerciseId,
                HttpMethod.PUT,
                updateEntity,
                ExerciseResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("更新されたメニュー");
    }

    @Test
    public void testDeleteExercise_Success() {
        // まずエクササイズを作成
        ExerciseRequest createRequest = new ExerciseRequest("削除用メニュー", UUID.randomUUID());
        HttpEntity<ExerciseRequest> createEntity = new HttpEntity<>(createRequest, headers);
        ResponseEntity<ExerciseResponse> createResponse = restTemplate.exchange(
                "/api/v1/exercises",
                HttpMethod.POST,
                createEntity,
                ExerciseResponse.class
        );
        
        UUID exerciseId = createResponse.getBody().getId();
        
        // 削除
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Void> response = restTemplate.exchange(
                "/api/v1/exercises/" + exerciseId,
                HttpMethod.DELETE,
                entity,
                Void.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        
        // 削除確認
        ResponseEntity<String> getResponse = restTemplate.exchange(
                "/api/v1/exercises/" + exerciseId,
                HttpMethod.GET,
                entity,
                String.class
        );
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testUnauthorizedAccess() {
        ResponseEntity<String> response = restTemplate.getForEntity(
                "/api/v1/exercises", 
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}