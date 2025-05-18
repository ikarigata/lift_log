package com.ikr.lift_log.domain.model;

import java.time.ZonedDateTime;
import java.util.UUID;

public class WorkoutRecord {
    private UUID id;
    private UUID workoutDayId;
    private UUID exerciseId;
    private String notes;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // コンストラクタ
    public WorkoutRecord() {
    }

    public WorkoutRecord(UUID id, UUID workoutDayId, UUID exerciseId, String notes,
            ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.id = id;
        this.workoutDayId = workoutDayId;
        this.exerciseId = exerciseId;
        this.notes = notes;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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