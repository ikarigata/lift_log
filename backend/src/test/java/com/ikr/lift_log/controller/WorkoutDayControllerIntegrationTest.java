package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.LoginRequest;
import com.ikr.lift_log.controller.dto.LoginResponse;
import com.ikr.lift_log.controller.dto.WorkoutDayRequest;
import com.ikr.lift_log.controller.dto.WorkoutDayResponse;
import com.ikr.lift_log.util.TestUtils;
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

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureTestRestTemplate
@Transactional
public class WorkoutDayControllerIntegrationTest {

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
    public void testCreateWorkoutDay_Success() {
        WorkoutDayRequest request = new WorkoutDayRequest("2025-01-30", "胸の日");
        HttpEntity<WorkoutDayRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<WorkoutDayResponse> response = restTemplate.exchange(
                "/api/v1/workout-days",
                HttpMethod.POST,
                entity,
                WorkoutDayResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("胸の日");
        assertThat(response.getBody().getDate()).isEqualTo("2025-01-30");
        assertThat(response.getBody().getId()).isNotNull();
    }

    @Test
    public void testGetWorkoutDays_Success() {
        // まずワークアウト日を作成
        WorkoutDayRequest request = new WorkoutDayRequest("2025-01-30", "テストワークアウト");
        HttpEntity<WorkoutDayRequest> createEntity = new HttpEntity<>(request, headers);
        restTemplate.exchange("/api/v1/workout-days", HttpMethod.POST, createEntity, WorkoutDayResponse.class);
        
        // ワークアウト日一覧を取得
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<List<WorkoutDayResponse>> response = restTemplate.exchange(
                "/api/v1/workout-days",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<WorkoutDayResponse>>() {}
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSizeGreaterThan(0);
    }

    @Test
    public void testGetWorkoutDayById_Success() {
        // まずワークアウト日を作成
        WorkoutDayRequest request = new WorkoutDayRequest("2025-01-30", "テストワークアウト");
        HttpEntity<WorkoutDayRequest> createEntity = new HttpEntity<>(request, headers);
        ResponseEntity<WorkoutDayResponse> createResponse = restTemplate.exchange(
                "/api/v1/workout-days", 
                HttpMethod.POST, 
                createEntity, 
                WorkoutDayResponse.class
        );
        
        String workoutDayId = createResponse.getBody().getId().toString();
        
        // IDで取得
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<WorkoutDayResponse> response = restTemplate.exchange(
                "/api/v1/workout-days/" + workoutDayId,
                HttpMethod.GET,
                entity,
                WorkoutDayResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("テストワークアウト");
    }

    @Test
    public void testUpdateWorkoutDay_Success() {
        // まずワークアウト日を作成
        WorkoutDayRequest createRequest = new WorkoutDayRequest("2025-01-30", "元のワークアウト");
        HttpEntity<WorkoutDayRequest> createEntity = new HttpEntity<>(createRequest, headers);
        ResponseEntity<WorkoutDayResponse> createResponse = restTemplate.exchange(
                "/api/v1/workout-days", 
                HttpMethod.POST, 
                createEntity, 
                WorkoutDayResponse.class
        );
        
        String workoutDayId = createResponse.getBody().getId().toString();
        
        // 更新
        WorkoutDayRequest updateRequest = new WorkoutDayRequest("2025-01-31", "更新されたワークアウト");
        HttpEntity<WorkoutDayRequest> updateEntity = new HttpEntity<>(updateRequest, headers);
        ResponseEntity<WorkoutDayResponse> response = restTemplate.exchange(
                "/api/v1/workout-days/" + workoutDayId,
                HttpMethod.PUT,
                updateEntity,
                WorkoutDayResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("更新されたワークアウト");
        assertThat(response.getBody().getDate()).isEqualTo("2025-01-31");
    }

    @Test
    public void testDeleteWorkoutDay_Success() {
        // まずワークアウト日を作成
        WorkoutDayRequest request = new WorkoutDayRequest("2025-01-30", "削除用ワークアウト");
        HttpEntity<WorkoutDayRequest> createEntity = new HttpEntity<>(request, headers);
        ResponseEntity<WorkoutDayResponse> createResponse = restTemplate.exchange(
                "/api/v1/workout-days", 
                HttpMethod.POST, 
                createEntity, 
                WorkoutDayResponse.class
        );
        
        String workoutDayId = createResponse.getBody().getId().toString();
        
        // 削除
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Void> response = restTemplate.exchange(
                "/api/v1/workout-days/" + workoutDayId,
                HttpMethod.DELETE,
                entity,
                Void.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        
        // 削除確認
        ResponseEntity<WorkoutDayResponse> getResponse = restTemplate.exchange(
                "/api/v1/workout-days/" + workoutDayId,
                HttpMethod.GET,
                entity,
                WorkoutDayResponse.class
        );
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testGetWorkoutDaysForCalendar_Success() {
        // まずワークアウト日を作成
        WorkoutDayRequest request = new WorkoutDayRequest("2025-01-15", "カレンダーテスト");
        HttpEntity<WorkoutDayRequest> createEntity = new HttpEntity<>(request, headers);
        restTemplate.exchange("/api/v1/workout-days", HttpMethod.POST, createEntity, WorkoutDayResponse.class);
        
        // カレンダー用データ取得
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<List<WorkoutDayResponse>> response = restTemplate.exchange(
                "/api/v1/workout-days/calendar?year=2025&month=1",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<WorkoutDayResponse>>() {}
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }

    @Test
    public void testCreateWorkoutDay_ValidationError_EmptyDate() {
        WorkoutDayRequest request = new WorkoutDayRequest("", "テストワークアウト");
        HttpEntity<WorkoutDayRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/workout-days",
                HttpMethod.POST,
                entity,
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testUnauthorizedAccess() {
        WorkoutDayRequest request = new WorkoutDayRequest("2025-01-30", "テストワークアウト");
        
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/v1/workout-days", 
                request, 
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}