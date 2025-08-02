package com.ikr.lift_log.controller.dto;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class WorkoutRecordResponse {
    private UUID id;
    private UUID workoutDayId;
    private UUID exerciseId;
    private String exerciseName;
    private List<WorkoutSetResponse> sets;
    private String memo;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // コンストラクタ
    public WorkoutRecordResponse() {
    }

    public WorkoutRecordResponse(UUID id, UUID workoutDayId, UUID exerciseId, String exerciseName, 
                                List<WorkoutSetResponse> sets, String memo, ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.id = id;
        this.workoutDayId = workoutDayId;
        this.exerciseId = exerciseId;
        this.exerciseName = exerciseName;
        this.sets = sets;
        this.memo = memo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ゲッターとセッター
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getWorkoutDayId() {
        return workoutDayId;
    }

    public void setWorkoutDayId(UUID workoutDayId) {
        this.workoutDayId = workoutDayId;
    }

    public UUID getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(UUID exerciseId) {
        this.exerciseId = exerciseId;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public List<WorkoutSetResponse> getSets() {
        return sets;
    }

    public void setSets(List<WorkoutSetResponse> sets) {
        this.sets = sets;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}