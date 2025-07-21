package com.ikr.lift_log.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.ikr.lift_log.domain.model.Exercise;

public interface ExerciseRepository {
    List<Exercise> findAll();

    Optional<Exercise> findById(UUID id);

    Exercise save(Exercise exercise);

    Exercise update(UUID id, Exercise exercise);

    void deleteById(UUID id);
}