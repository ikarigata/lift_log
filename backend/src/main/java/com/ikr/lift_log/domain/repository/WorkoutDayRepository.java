package com.ikr.lift_log.domain.repository;

import com.ikr.lift_log.domain.model.WorkoutDay;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkoutDayRepository {

    List<WorkoutDay> findByUserId(UUID userId);

    List<WorkoutDay> findByUserIdAndDateBetween(UUID userId, LocalDate fromDate, LocalDate toDate);

    Optional<WorkoutDay> findById(UUID id);

    WorkoutDay save(WorkoutDay workoutDay);

    void deleteById(UUID id);
}