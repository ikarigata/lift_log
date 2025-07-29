package com.ikr.lift_log.domain.repository;

import com.ikr.lift_log.domain.model.WorkoutRecord;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkoutRecordRepository {

    List<WorkoutRecord> findByWorkoutDayId(UUID workoutDayId);

    List<WorkoutRecord> findByUserId(UUID userId);

    Optional<WorkoutRecord> findById(UUID id);

    WorkoutRecord save(WorkoutRecord workoutRecord);

    void deleteById(UUID id);
}