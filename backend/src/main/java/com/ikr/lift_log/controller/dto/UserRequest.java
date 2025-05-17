package com.ikr.lift_log.controller.dto;

public class UserRequest {
    private String name;

    // コンストラクタ
    public UserRequest() {
    }

    public UserRequest(String name) {
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