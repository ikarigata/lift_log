package com.ikr.lift_log.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ExerciseProgressResponse {
    private String exerciseId;
    private String exerciseName;
    private String muscleGroup;
    private List<ProgressData> progressData;
    private BigDecimal maxWeight;
    private int totalSets;
    private int totalReps;

    public static class ProgressData {
        private LocalDate date;
        private BigDecimal totalVolume;
        private BigDecimal maxWeight;
        private java.util.List<SetData> sets;

        public static class SetData {
            private BigDecimal weight;
            private int reps;

            public SetData() {}

            public SetData(BigDecimal weight, int reps) {
                this.weight = weight;
                this.reps = reps;
            }

            public BigDecimal getWeight() { return weight; }
            public void setWeight(BigDecimal weight) { this.weight = weight; }

            public int getReps() { return reps; }
            public void setReps(int reps) { this.reps = reps; }
        }

        public ProgressData() {}

        public ProgressData(LocalDate date, BigDecimal totalVolume, BigDecimal maxWeight, java.util.List<SetData> sets) {
            this.date = date;
            this.totalVolume = totalVolume;
            this.maxWeight = maxWeight;
            this.sets = sets;
        }

        // Getters and Setters
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public BigDecimal getTotalVolume() { return totalVolume; }
        public void setTotalVolume(BigDecimal totalVolume) { this.totalVolume = totalVolume; }

        public BigDecimal getMaxWeight() { return maxWeight; }
        public void setMaxWeight(BigDecimal maxWeight) { this.maxWeight = maxWeight; }

        public java.util.List<SetData> getSets() { return sets; }
        public void setSets(java.util.List<SetData> sets) { this.sets = sets; }
    }

    public ExerciseProgressResponse() {}

    // Getters and Setters
    public String getExerciseId() { return exerciseId; }
    public void setExerciseId(String exerciseId) { this.exerciseId = exerciseId; }

    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }

    public String getMuscleGroup() { return muscleGroup; }
    public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }

    public List<ProgressData> getProgressData() { return progressData; }
    public void setProgressData(List<ProgressData> progressData) { this.progressData = progressData; }

    public BigDecimal getMaxWeight() { return maxWeight; }
    public void setMaxWeight(BigDecimal maxWeight) { this.maxWeight = maxWeight; }

    public int getTotalSets() { return totalSets; }
    public void setTotalSets(int totalSets) { this.totalSets = totalSets; }

    public int getTotalReps() { return totalReps; }
    public void setTotalReps(int totalReps) { this.totalReps = totalReps; }
}