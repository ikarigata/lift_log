package com.ikr.lift_log.controller.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

public class ExerciseResponse {
    private UUID id;
    private String name;
    private String description;
    private UUID muscleGroupId;
    private String muscleGroup;
    private ZonedDateTime createdAt;

    // コンストラクタ
    public ExerciseResponse() {
    }

    public ExerciseResponse(UUID id, String name, String description, UUID muscleGroupId, String muscleGroup, ZonedDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.muscleGroupId = muscleGroupId;
        this.muscleGroup = muscleGroup;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getMuscleGroupId() {
        return muscleGroupId;
    }

    public void setMuscleGroupId(UUID muscleGroupId) {
        this.muscleGroupId = muscleGroupId;
    }

    public String getMuscleGroup() {
        return muscleGroup;
    }

    public void setMuscleGroup(String muscleGroup) {
        this.muscleGroup = muscleGroup;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }
}