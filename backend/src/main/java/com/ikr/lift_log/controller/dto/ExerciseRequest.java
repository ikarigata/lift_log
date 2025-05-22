package com.ikr.lift_log.controller.dto;

import java.util.List;
import java.util.UUID;

public class ExerciseRequest {
    private String name;
    private String description;
    private List<ExerciseMuscleGroupItemRequest> muscleGroups;

    // コンストラクタ
    public ExerciseRequest() {
    }

    public ExerciseRequest(String name, String description, List<ExerciseMuscleGroupItemRequest> muscleGroups) {
        this.name = name;
        this.description = description;
        this.muscleGroups = muscleGroups;
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

    public List<ExerciseMuscleGroupItemRequest> getMuscleGroups() {
        return muscleGroups;
    }

    public void setMuscleGroups(List<ExerciseMuscleGroupItemRequest> muscleGroups) {
        this.muscleGroups = muscleGroups;
    }

    // Inner class for muscle group items
    public static class ExerciseMuscleGroupItemRequest {
        private UUID muscleGroupId;
        private Boolean isPrimary; // Use Boolean to allow null, default to false if not provided

        public ExerciseMuscleGroupItemRequest() {
        }

        public ExerciseMuscleGroupItemRequest(UUID muscleGroupId, Boolean isPrimary) {
            this.muscleGroupId = muscleGroupId;
            this.isPrimary = isPrimary;
        }

        public UUID getMuscleGroupId() {
            return muscleGroupId;
        }

        public void setMuscleGroupId(UUID muscleGroupId) {
            this.muscleGroupId = muscleGroupId;
        }

        public Boolean getPrimary() { // Getter for Boolean
            return isPrimary;
        }

        public void setPrimary(Boolean primary) { // Setter for Boolean
            isPrimary = primary;
        }
        
        public boolean isPrimaryEffective() { // Helper to get effective boolean value
            return isPrimary != null && isPrimary;
        }
    }
}