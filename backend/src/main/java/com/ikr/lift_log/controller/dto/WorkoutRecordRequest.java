package com.ikr.lift_log.controller.dto;

import java.util.UUID;

public class WorkoutRecordRequest {
    private UUID exerciseId;
    private String notes;

    // コンストラクタ
    public WorkoutRecordRequest() {
    }

    public WorkoutRecordRequest(UUID exerciseId, String notes) {
        this.exerciseId = exerciseId;
        this.notes = notes;
    }

    // ゲッターとセッター
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