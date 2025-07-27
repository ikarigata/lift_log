package com.ikr.lift_log.controller.dto;

public class ExerciseRequest {
    private String name;
    private String muscleGroup;

    // コンストラクタ
    public ExerciseRequest() {
    }

    public ExerciseRequest(String name, String muscleGroup) {
        this.name = name;
        this.muscleGroup = muscleGroup;
    }

    // ゲッターとセッター
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMuscleGroup() {
        return muscleGroup;
    }

    public void setMuscleGroup(String muscleGroup) {
        this.muscleGroup = muscleGroup;
    }
}