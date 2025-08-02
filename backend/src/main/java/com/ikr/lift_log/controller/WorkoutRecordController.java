package com.ikr.lift_log.controller;

import com.ikr.lift_log.domain.model.WorkoutRecord;
import com.ikr.lift_log.domain.model.WorkoutSet;
import com.ikr.lift_log.service.WorkoutRecordService;
import com.ikr.lift_log.service.WorkoutSetService;
import com.ikr.lift_log.controller.dto.WorkoutRecordRequest;
import com.ikr.lift_log.controller.dto.WorkoutRecordResponse;
import com.ikr.lift_log.controller.dto.WorkoutSetRequest;
import com.ikr.lift_log.security.AuthenticationUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import jakarta.validation.Valid;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class WorkoutRecordController {

    private final WorkoutRecordService workoutRecordService;
    private final WorkoutSetService workoutSetService;

    public WorkoutRecordController(WorkoutRecordService workoutRecordService, WorkoutSetService workoutSetService) {
        this.workoutRecordService = workoutRecordService;
        this.workoutSetService = workoutSetService;
    }

    @GetMapping("/workout-records")
    public ResponseEntity<List<WorkoutRecordResponse>> getAllWorkoutRecords() {
        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        List<WorkoutRecordResponse> workoutRecords = workoutRecordService.getWorkoutRecordResponsesByUserId(userId);
        return ResponseEntity.ok(workoutRecords);
    }

    @GetMapping("/workout-days/{workoutDayId}/workout-records")
    public ResponseEntity<List<WorkoutRecordResponse>> getWorkoutRecordsByWorkoutDayId(@PathVariable UUID workoutDayId) {
        List<WorkoutRecordResponse> workoutRecords = workoutRecordService.getWorkoutRecordResponsesByWorkoutDayId(workoutDayId);
        return ResponseEntity.ok(workoutRecords);
    }

    @GetMapping("/workout-records/{id}")
    public ResponseEntity<WorkoutRecordResponse> getWorkoutRecordById(@PathVariable UUID id) {
        return workoutRecordService.getWorkoutRecordResponseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/workout-records")
    public ResponseEntity<WorkoutRecord> createWorkoutRecord(@Valid @RequestBody WorkoutRecordRequest request) {
        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        
        WorkoutRecord workoutRecord = new WorkoutRecord();
        workoutRecord.setWorkoutDayId(request.getWorkoutDayId());
        workoutRecord.setExerciseId(request.getExerciseId());
        workoutRecord.setNotes(request.getMemo());

        WorkoutRecord createdRecord = workoutRecordService.createWorkoutRecord(workoutRecord);

        // セットがある場合は一緒に作成
        if (request.getSets() != null && !request.getSets().isEmpty()) {
            for (WorkoutSetRequest setRequest : request.getSets()) {
                WorkoutSet workoutSet = new WorkoutSet();
                workoutSet.setWorkoutRecordId(createdRecord.getId());
                workoutSet.setWeight(setRequest.getWeight());
                workoutSet.setReps(setRequest.getReps());
                if (setRequest.getSubReps() != null) {
                    workoutSet.setSubReps(setRequest.getSubReps());
                }
                workoutSetService.createWorkoutSet(workoutSet);
            }
        }

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/v1/workout-records/{id}")
                .buildAndExpand(createdRecord.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdRecord);
    }

    @PostMapping("/workout-days/{workoutDayId}/workout-records")
    public ResponseEntity<WorkoutRecord> createWorkoutRecordWithPath(
            @PathVariable UUID workoutDayId,
            @Valid @RequestBody WorkoutRecordRequest request) {

        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();

        WorkoutRecord workoutRecord = new WorkoutRecord();
        workoutRecord.setWorkoutDayId(workoutDayId);
        workoutRecord.setExerciseId(request.getExerciseId());
        workoutRecord.setNotes(request.getMemo());

        WorkoutRecord createdRecord = workoutRecordService.createWorkoutRecord(workoutRecord);

        // セットがある場合は一緒に作成
        if (request.getSets() != null && !request.getSets().isEmpty()) {
            for (WorkoutSetRequest setRequest : request.getSets()) {
                WorkoutSet workoutSet = new WorkoutSet();
                workoutSet.setWorkoutRecordId(createdRecord.getId());
                workoutSet.setWeight(setRequest.getWeight());
                workoutSet.setReps(setRequest.getReps());
                if (setRequest.getSubReps() != null) {
                    workoutSet.setSubReps(setRequest.getSubReps());
                }
                workoutSetService.createWorkoutSet(workoutSet);
            }
        }

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
            @Valid @RequestBody WorkoutRecordRequest request) {

        // 認証されたユーザーIDを取得  
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        
        WorkoutRecord workoutRecord = new WorkoutRecord();
        workoutRecord.setExerciseId(request.getExerciseId());
        workoutRecord.setNotes(request.getMemo());

        // 既存のセットを削除して新しいセットで置き換え
        workoutSetService.deleteWorkoutSetsByWorkoutRecordId(id);
        
        // 新しいセットを作成
        if (request.getSets() != null && !request.getSets().isEmpty()) {
            for (WorkoutSetRequest setRequest : request.getSets()) {
                WorkoutSet workoutSet = new WorkoutSet();
                workoutSet.setWorkoutRecordId(id);
                workoutSet.setWeight(setRequest.getWeight());
                workoutSet.setReps(setRequest.getReps());
                if (setRequest.getSubReps() != null) {
                    workoutSet.setSubReps(setRequest.getSubReps());
                }
                workoutSetService.createWorkoutSet(workoutSet);
            }
        }

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