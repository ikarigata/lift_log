package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.*;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.service.ExerciseService;
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

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureTestRestTemplate
@Transactional
public class WorkoutRecordControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ExerciseService exerciseService;

    private String authToken;
    private HttpHeaders headers;
    private UUID workoutDayId;
    private UUID exerciseId;

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

        // テスト用ワークアウト日を作成
        WorkoutDayRequest workoutDayRequest = new WorkoutDayRequest("2025-01-30", "テストワークアウト");
        HttpEntity<WorkoutDayRequest> workoutDayEntity = new HttpEntity<>(workoutDayRequest, headers);
        ResponseEntity<WorkoutDayResponse> workoutDayResponse = restTemplate.exchange(
                "/api/v1/workout-days",
                HttpMethod.POST,
                workoutDayEntity,
                WorkoutDayResponse.class
        );
        workoutDayId = workoutDayResponse.getBody().getId();

        // テスト用エクササイズを取得（既存のものを使用）
        List<Exercise> exercises = exerciseService.getAllExercises();
        if (!exercises.isEmpty()) {
            exerciseId = exercises.get(0).getId();
        }
    }

    @Test
    public void testCreateWorkoutRecord_Success() {
        WorkoutSetRequest setRequest1 = new WorkoutSetRequest(1, new BigDecimal("100.0"), 10, 2);
        WorkoutSetRequest setRequest2 = new WorkoutSetRequest(2, new BigDecimal("105.0"), 8, 1);
        
        WorkoutRecordRequest request = new WorkoutRecordRequest(
                workoutDayId, 
                exerciseId, 
                Arrays.asList(setRequest1, setRequest2),
                "テストメモ"
        );
        
        HttpEntity<WorkoutRecordRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/workout-records",
                HttpMethod.POST,
                entity,
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    public void testCreateWorkoutRecordWithPath_Success() {
        WorkoutSetRequest setRequest = new WorkoutSetRequest(1, new BigDecimal("80.0"), 12, 0);
        
        WorkoutRecordRequest request = new WorkoutRecordRequest(
                null, // workoutDayIdはパスから取得
                exerciseId, 
                Arrays.asList(setRequest),
                "パステストメモ"
        );
        
        HttpEntity<WorkoutRecordRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/workout-days/" + workoutDayId + "/workout-records",
                HttpMethod.POST,
                entity,
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    public void testGetAllWorkoutRecords_Success() {
        // まずワークアウトレコードを作成
        WorkoutSetRequest setRequest = new WorkoutSetRequest(1, new BigDecimal("100.0"), 10, 0);
        WorkoutRecordRequest createRequest = new WorkoutRecordRequest(
                workoutDayId, 
                exerciseId, 
                Arrays.asList(setRequest),
                "取得テストメモ"
        );
        
        HttpEntity<WorkoutRecordRequest> createEntity = new HttpEntity<>(createRequest, headers);
        restTemplate.exchange("/api/v1/workout-records", HttpMethod.POST, createEntity, String.class);
        
        // 全ワークアウトレコードを取得
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/workout-records",
                HttpMethod.GET,
                entity,
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void testGetWorkoutRecordsByWorkoutDayId_Success() {
        // まずワークアウトレコードを作成
        WorkoutSetRequest setRequest = new WorkoutSetRequest(1, new BigDecimal("100.0"), 10, 0);
        WorkoutRecordRequest createRequest = new WorkoutRecordRequest(
                workoutDayId, 
                exerciseId, 
                Arrays.asList(setRequest),
                "ワークアウト日別取得テスト"
        );
        
        HttpEntity<WorkoutRecordRequest> createEntity = new HttpEntity<>(createRequest, headers);
        restTemplate.exchange("/api/v1/workout-records", HttpMethod.POST, createEntity, String.class);
        
        // ワークアウト日別でレコードを取得
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/workout-days/" + workoutDayId + "/workout-records",
                HttpMethod.GET,
                entity,
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void testCreateWorkoutRecord_ValidationError_NullWorkoutDayId() {
        WorkoutRecordRequest request = new WorkoutRecordRequest(
                null, // 必須フィールドがnull
                exerciseId, 
                Arrays.asList(),
                "バリデーションテスト"
        );
        
        HttpEntity<WorkoutRecordRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/workout-records",
                HttpMethod.POST,
                entity,
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testCreateWorkoutRecord_ValidationError_NullExerciseId() {
        WorkoutRecordRequest request = new WorkoutRecordRequest(
                workoutDayId, 
                null, // 必須フィールドがnull
                Arrays.asList(),
                "バリデーションテスト"
        );
        
        HttpEntity<WorkoutRecordRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/workout-records",
                HttpMethod.POST,
                entity,
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testCreateWorkoutRecord_ValidationError_InvalidSetData() {
        // 無効なセットデータ（重量が負の値）
        WorkoutSetRequest invalidSetRequest = new WorkoutSetRequest(1, new BigDecimal("-10.0"), 10, 0);
        
        WorkoutRecordRequest request = new WorkoutRecordRequest(
                workoutDayId, 
                exerciseId, 
                Arrays.asList(invalidSetRequest),
                "無効セットテスト"
        );
        
        HttpEntity<WorkoutRecordRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/workout-records",
                HttpMethod.POST,
                entity,
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testUnauthorizedAccess() {
        WorkoutRecordRequest request = new WorkoutRecordRequest(
                workoutDayId, 
                exerciseId, 
                Arrays.asList(),
                "認証なしテスト"
        );
        
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/v1/workout-records", 
                request, 
                String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}