package com.ikr.lift_log.controller.dto;

public class MuscleGroupRequest {
    private String name;

    // コンストラクタ
    public MuscleGroupRequest() {
    }

    public MuscleGroupRequest(String name) {
        this.name = name;
    }

    // ゲッターとセッター
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}