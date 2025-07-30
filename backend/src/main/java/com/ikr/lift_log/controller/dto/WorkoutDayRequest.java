package com.ikr.lift_log.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class WorkoutDayRequest {
    @NotBlank
    private String date;
    
    private String name;

    // コンストラクタ
    public WorkoutDayRequest() {
    }

    public WorkoutDayRequest(String date, String name) {
        this.date = date;
        this.name = name;
    }

    // ゲッターとセッター
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}