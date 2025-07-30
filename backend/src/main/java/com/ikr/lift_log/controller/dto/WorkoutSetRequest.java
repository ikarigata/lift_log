package com.ikr.lift_log.controller.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class WorkoutSetRequest {
    @NotNull
    @Min(1)
    private Integer setNumber;
    
    @NotNull
    @DecimalMin("0.0")
    private BigDecimal weight;
    
    @NotNull
    @Min(1)
    private Integer reps;
    
    @Min(0)
    private Integer subReps;

    // コンストラクタ
    public WorkoutSetRequest() {
    }

    public WorkoutSetRequest(Integer setNumber, BigDecimal weight, Integer reps, Integer subReps) {
        this.setNumber = setNumber;
        this.weight = weight;
        this.reps = reps;
        this.subReps = subReps;
    }

    // ゲッターとセッター
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
}