package com.ikr.lift_log.controller.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class WorkoutRecordRequest {
    @NotNull
    private UUID workoutDayId;
    
    @NotNull
    private UUID exerciseId;
    
    @Valid
    private List<WorkoutSetRequest> sets;
    
    private String memo;

    // コンストラクタ
    public WorkoutRecordRequest() {
    }

    public WorkoutRecordRequest(UUID workoutDayId, UUID exerciseId, List<WorkoutSetRequest> sets, String memo) {
        this.workoutDayId = workoutDayId;
        this.exerciseId = exerciseId;
        this.sets = sets;
        this.memo = memo;
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

    public List<WorkoutSetRequest> getSets() {
        return sets;
    }

    public void setSets(List<WorkoutSetRequest> sets) {
        this.sets = sets;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getNotes() {
        return memo;
    }

    public void setNotes(String notes) {
        this.memo = notes;
    }
}