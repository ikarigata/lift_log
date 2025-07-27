package com.ikr.lift_log.controller.dto;

import java.util.UUID;

public class WorkoutRecordRequest {
    private UUID workoutDayId;
    private UUID exerciseId;
    private String notes;

    // コンストラクタ
    public WorkoutRecordRequest() {
    }

    public WorkoutRecordRequest(UUID workoutDayId, UUID exerciseId, String notes) {
        this.workoutDayId = workoutDayId;
        this.exerciseId = exerciseId;
        this.notes = notes;
    }

    // ゲッターとセッター
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
}