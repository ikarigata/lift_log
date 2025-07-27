package com.ikr.lift_log.domain.model;

import java.time.ZonedDateTime;
import java.util.UUID;

public class Exercise {
    private UUID id;
    private UUID userId;
    private String name;
    private String description;
    private UUID muscleGroupId;
    private ZonedDateTime createdAt;

    // コンストラクタ
    public Exercise() {
    }

    public Exercise(UUID id, UUID userId, String name, String description, UUID muscleGroupId, ZonedDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.muscleGroupId = muscleGroupId;
        this.createdAt = createdAt;
    }

    // ゲッターとセッター
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

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

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getMuscleGroupId() {
        return muscleGroupId;
    }

    public void setMuscleGroupId(UUID muscleGroupId) {
        this.muscleGroupId = muscleGroupId;
    }
}