package com.ikr.lift_log.controller;

import com.ikr.lift_log.domain.model.WorkoutDay;
import com.ikr.lift_log.controller.dto.WorkoutDayRequest;
import com.ikr.lift_log.controller.dto.WorkoutDayResponse;
import com.ikr.lift_log.security.AuthenticationUtil;
import com.ikr.lift_log.service.WorkoutDayService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import jakarta.validation.Valid;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/workout-days")
public class WorkoutDayController {

    private final WorkoutDayService workoutDayService;

    public WorkoutDayController(WorkoutDayService workoutDayService) {
        this.workoutDayService = workoutDayService;
    }

    @GetMapping
    public ResponseEntity<List<WorkoutDayResponse>> getWorkoutDays(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();

        if (fromDate != null && toDate != null) {
            List<WorkoutDay> workoutDays = workoutDayService.getWorkoutDaysByUserIdAndDateRange(userId, fromDate,
                    toDate);
            List<WorkoutDayResponse> responses = workoutDays.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } else {
            List<WorkoutDay> workoutDays = workoutDayService.getWorkoutDaysByUserId(userId);
            List<WorkoutDayResponse> responses = workoutDays.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutDayResponse> getWorkoutDayById(@PathVariable UUID id) {
        return workoutDayService.getWorkoutDayById(id)
                .map(this::convertToResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WorkoutDayResponse> createWorkoutDay(@Valid @RequestBody WorkoutDayRequest request) {
        // 認証されたユーザーIDを設定
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        
        WorkoutDay workoutDay = new WorkoutDay();
        workoutDay.setUserId(userId);
        workoutDay.setDate(LocalDate.parse(request.getDate()));
        workoutDay.setTitle(request.getName()); // フロントエンドのnameをバックエンドのtitleにマッピング
        
        WorkoutDay createdWorkoutDay = workoutDayService.createWorkoutDay(workoutDay);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdWorkoutDay.getId())
                .toUri();

        return ResponseEntity.created(location).body(convertToResponse(createdWorkoutDay));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutDayResponse> updateWorkoutDay(@PathVariable UUID id, @Valid @RequestBody WorkoutDayRequest request) {
        WorkoutDay workoutDay = new WorkoutDay();
        workoutDay.setDate(LocalDate.parse(request.getDate()));
        workoutDay.setTitle(request.getName()); // フロントエンドのnameをバックエンドのtitleにマッピング
        
        return workoutDayService.updateWorkoutDay(id, workoutDay)
                .map(this::convertToResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkoutDay(@PathVariable UUID id) {
        if (workoutDayService.deleteWorkoutDay(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<WorkoutDayResponse>> getWorkoutDaysForCalendar(
            @RequestParam int year,
            @RequestParam int month) {

        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();

        // month-1 because frontend sends 1-based month, but LocalDate expects 0-based
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<WorkoutDay> workoutDays = workoutDayService.getWorkoutDaysByUserIdAndDateRange(userId, startDate,
                endDate);
        List<WorkoutDayResponse> responses = workoutDays.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    private WorkoutDayResponse convertToResponse(WorkoutDay workoutDay) {
        return new WorkoutDayResponse(
                workoutDay.getId(),
                workoutDay.getDate().toString(),
                workoutDay.getTitle(), // バックエンドのtitleをフロントエンドのnameにマッピング
                workoutDay.getCreatedAt(),
                workoutDay.getUpdatedAt()
        );
    }
}