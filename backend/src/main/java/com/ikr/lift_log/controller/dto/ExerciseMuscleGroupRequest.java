package com.ikr.lift_log.controller.dto;

import java.util.UUID;

public class ExerciseMuscleGroupRequest {
    private UUID muscleGroupId;
    private boolean isPrimary;

    // コンストラクタ
    public ExerciseMuscleGroupRequest() {
    }

    public ExerciseMuscleGroupRequest(UUID muscleGroupId, boolean isPrimary) {
        this.muscleGroupId = muscleGroupId;
        this.isPrimary = isPrimary;
    }

    // ゲッターとセッター
    public UUID getMuscleGroupId() {
        return muscleGroupId;
    }

    public void setMuscleGroupId(UUID muscleGroupId) {
        this.muscleGroupId = muscleGroupId;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }
}