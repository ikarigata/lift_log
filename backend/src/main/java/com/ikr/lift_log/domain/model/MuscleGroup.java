package com.ikr.lift_log.domain.model;

import java.time.ZonedDateTime;
import java.util.UUID;

public class MuscleGroup {
    private UUID id;
    private String name;
    private ZonedDateTime createdAt;

    // コンストラクタ
    public MuscleGroup() {
    }

    public MuscleGroup(UUID id, String name, ZonedDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }

    // ゲッターとセッター
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }
}