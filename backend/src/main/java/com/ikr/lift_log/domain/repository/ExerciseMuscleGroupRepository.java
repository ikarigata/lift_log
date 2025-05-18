package com.ikr.lift_log.domain.repository;

import com.ikr.lift_log.domain.model.ExerciseMuscleGroup;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExerciseMuscleGroupRepository {
    List<ExerciseMuscleGroup> findByExerciseId(UUID exerciseId);

    Optional<ExerciseMuscleGroup> findById(UUID id);

    ExerciseMuscleGroup save(ExerciseMuscleGroup exerciseMuscleGroup);

    void deleteById(UUID id);
}