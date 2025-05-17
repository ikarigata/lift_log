package com.ikr.lift_log.controller.dto;

public class ExerciseRequest {
    private String name;
    private String description;

    // コンストラクタ
    public ExerciseRequest() {
    }

    public ExerciseRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // ゲッターとセッター
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}