package com.ikr.lift_log.controller.dto;

public class WorkoutSetResponse {
    private int setNumber;
    private double weight;
    private int reps;
    private Integer subReps;

    // コンストラクタ
    public WorkoutSetResponse() {
    }

    public WorkoutSetResponse(int setNumber, double weight, int reps, Integer subReps) {
        this.setNumber = setNumber;
        this.weight = weight;
        this.reps = reps;
        this.subReps = subReps;
    }

    // ゲッターとセッター
    public int getSetNumber() {
        return setNumber;
    }

    public void setSetNumber(int setNumber) {
        this.setNumber = setNumber;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public Integer getSubReps() {
        return subReps;
    }

    public void setSubReps(Integer subReps) {
        this.subReps = subReps;
    }
}