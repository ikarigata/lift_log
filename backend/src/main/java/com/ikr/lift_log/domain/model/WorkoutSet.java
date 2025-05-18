package com.ikr.lift_log.domain.model;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

public class WorkoutSet {
    private UUID id;
    private UUID workoutRecordId;
    private int reps;
    private BigDecimal weight;
    private BigDecimal volume; // 計算フィールド (reps * weight)
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // コンストラクタ
    public WorkoutSet() {
    }

    public WorkoutSet(UUID id, UUID workoutRecordId, int reps, BigDecimal weight,
            ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.id = id;
        this.workoutRecordId = workoutRecordId;
        this.reps = reps;
        this.weight = weight;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        calculateVolume();
    }

    // ゲッターとセッター
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getWorkoutRecordId() {
        return workoutRecordId;
    }

    public void setWorkoutRecordId(UUID workoutRecordId) {
        this.workoutRecordId = workoutRecordId;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
        calculateVolume();
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
        calculateVolume();
    }

    public BigDecimal getVolume() {
        return volume;
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

    // ヘルパーメソッド
    private void calculateVolume() {
        if (weight != null) {
            this.volume = weight.multiply(BigDecimal.valueOf(reps));
        }
    }
}