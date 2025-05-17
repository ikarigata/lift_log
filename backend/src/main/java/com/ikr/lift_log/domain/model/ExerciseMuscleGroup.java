package com.ikr.lift_log.domain.model;

import java.util.UUID;

public class ExerciseMuscleGroup {
    private UUID id;
    private UUID exerciseId;
    private UUID muscleGroupId;
    private boolean isPrimary;

    // コンストラクタ
    public ExerciseMuscleGroup() {
    }

    public ExerciseMuscleGroup(UUID id, UUID exerciseId, UUID muscleGroupId, boolean isPrimary) {
        this.id = id;
        this.exerciseId = exerciseId;
        this.muscleGroupId = muscleGroupId;
        this.isPrimary = isPrimary;
    }

    // ゲッターとセッター
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(UUID exerciseId) {
        this.exerciseId = exerciseId;
    }

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