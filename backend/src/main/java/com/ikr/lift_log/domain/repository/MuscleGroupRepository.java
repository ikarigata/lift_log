package com.ikr.lift_log.domain.repository;

import com.ikr.lift_log.domain.model.MuscleGroup;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MuscleGroupRepository {
    List<MuscleGroup> findAll();

    Optional<MuscleGroup> findById(UUID id);

    Optional<MuscleGroup> findByName(String name);

    MuscleGroup save(MuscleGroup muscleGroup);
}