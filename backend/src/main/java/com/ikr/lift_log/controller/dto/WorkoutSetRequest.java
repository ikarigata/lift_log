package com.ikr.lift_log.controller.dto;

public class WorkoutSetRequest {
    private int reps;
    private String weight;

    // コンストラクタ
    public WorkoutSetRequest() {
    }

    public WorkoutSetRequest(int reps, String weight) {
        this.reps = reps;
        this.weight = weight;
    }

    // ゲッターとセッター
    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }
}