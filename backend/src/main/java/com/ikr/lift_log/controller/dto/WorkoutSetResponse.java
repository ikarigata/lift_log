package com.ikr.lift_log.controller.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

public class WorkoutSetResponse {
    private UUID id;
    private Integer setNumber;
    private BigDecimal weight;
    private Integer reps;
    private Integer subReps;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // コンストラクタ
    public WorkoutSetResponse() {
    }

    public WorkoutSetResponse(UUID id, Integer setNumber, BigDecimal weight, Integer reps, Integer subReps, ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.id = id;
        this.setNumber = setNumber;
        this.weight = weight;
        this.reps = reps;
        this.subReps = subReps;
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

    public Integer getSetNumber() {
        return setNumber;
    }

    public void setSetNumber(Integer setNumber) {
        this.setNumber = setNumber;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Integer getSubReps() {
        return subReps;
    }

    public void setSubReps(Integer subReps) {
        this.subReps = subReps;
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