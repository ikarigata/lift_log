package com.ikr.lift_log.domain.repository;

import com.ikr.lift_log.domain.model.WorkoutSet;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkoutSetRepository {
    List<WorkoutSet> findByWorkoutRecordId(UUID workoutRecordId);

    Optional<WorkoutSet> findById(UUID id);

    WorkoutSet save(WorkoutSet workoutSet);

    void deleteById(UUID id);
    
    List<WorkoutSet> getWorkoutSetsByExerciseIdAndUserId(UUID exerciseId, UUID userId);
}