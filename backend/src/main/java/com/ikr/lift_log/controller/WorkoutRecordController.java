package com.ikr.lift_log.controller;

import com.ikr.lift_log.domain.model.WorkoutRecord;
import com.ikr.lift_log.service.WorkoutRecordService;
import com.ikr.lift_log.controller.dto.WorkoutRecordRequest;
import com.ikr.lift_log.security.AuthenticationUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class WorkoutRecordController {

    private final WorkoutRecordService workoutRecordService;

    public WorkoutRecordController(WorkoutRecordService workoutRecordService) {
        this.workoutRecordService = workoutRecordService;
    }

    @GetMapping("/workout-records")
    public ResponseEntity<List<WorkoutRecord>> getAllWorkoutRecords() {
        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        List<WorkoutRecord> workoutRecords = workoutRecordService.getWorkoutRecordsByUserId(userId);
        return ResponseEntity.ok(workoutRecords);
    }

    @GetMapping("/workout-days/{workoutDayId}/workout-records")
    public ResponseEntity<List<WorkoutRecord>> getWorkoutRecordsByWorkoutDayId(@PathVariable UUID workoutDayId) {
        List<WorkoutRecord> workoutRecords = workoutRecordService.getWorkoutRecordsByWorkoutDayId(workoutDayId);
        return ResponseEntity.ok(workoutRecords);
    }

    @GetMapping("/workout-records/{id}")
    public ResponseEntity<WorkoutRecord> getWorkoutRecordById(@PathVariable UUID id) {
        return workoutRecordService.getWorkoutRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/workout-records")
    public ResponseEntity<WorkoutRecord> createWorkoutRecord(@RequestBody WorkoutRecordRequest request) {
        WorkoutRecord workoutRecord = new WorkoutRecord();
        workoutRecord.setWorkoutDayId(request.getWorkoutDayId());
        workoutRecord.setExerciseId(request.getExerciseId());
        workoutRecord.setNotes(request.getNotes());

        WorkoutRecord createdRecord = workoutRecordService.createWorkoutRecord(workoutRecord);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/v1/workout-records/{id}")
                .buildAndExpand(createdRecord.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdRecord);
    }

    @GetMapping("/workout-days/{workoutDayId}/workout-records")
    public ResponseEntity<List<WorkoutRecord>> getWorkoutRecordsByWorkoutDayId(@PathVariable UUID workoutDayId) {
        List<WorkoutRecord> workoutRecords = workoutRecordService.getWorkoutRecordsByWorkoutDayId(workoutDayId);
        return ResponseEntity.ok(workoutRecords);
    }

    @GetMapping("/workout-records/{id}")
    public ResponseEntity<WorkoutRecord> getWorkoutRecordById(@PathVariable UUID id) {
        return workoutRecordService.getWorkoutRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/workout-days/{workoutDayId}/workout-records")
    public ResponseEntity<WorkoutRecord> createWorkoutRecordWithPath(
            @PathVariable UUID workoutDayId,
            @RequestBody WorkoutRecordRequest request) {

        WorkoutRecord workoutRecord = new WorkoutRecord();
        workoutRecord.setWorkoutDayId(workoutDayId);
        workoutRecord.setExerciseId(request.getExerciseId());
        workoutRecord.setNotes(request.getNotes());

        WorkoutRecord createdRecord = workoutRecordService.createWorkoutRecord(workoutRecord);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/v1/workout-records/{id}")
                .buildAndExpand(createdRecord.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdRecord);
    }

    @PutMapping("/workout-records/{id}")
    public ResponseEntity<WorkoutRecord> updateWorkoutRecord(
            @PathVariable UUID id,
            @RequestBody WorkoutRecordRequest request) {

        WorkoutRecord workoutRecord = new WorkoutRecord();
        workoutRecord.setExerciseId(request.getExerciseId());
        workoutRecord.setNotes(request.getNotes());

        return workoutRecordService.updateWorkoutRecord(id, workoutRecord)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/workout-records/{id}")
    public ResponseEntity<Void> deleteWorkoutRecord(@PathVariable UUID id) {
        if (workoutRecordService.deleteWorkoutRecord(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}