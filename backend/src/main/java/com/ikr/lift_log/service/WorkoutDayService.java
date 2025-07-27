package com.ikr.lift_log.service;

import com.ikr.lift_log.domain.model.WorkoutDay;
import com.ikr.lift_log.domain.repository.WorkoutDayRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WorkoutDayService {

    private final WorkoutDayRepository workoutDayRepository;

    public WorkoutDayService(WorkoutDayRepository workoutDayRepository) {
        this.workoutDayRepository = workoutDayRepository;
    }

    public List<WorkoutDay> getWorkoutDaysByUserId(UUID userId) {
        return workoutDayRepository.findByUserId(userId);
    }

    public List<WorkoutDay> getWorkoutDaysByUserIdAndDateRange(UUID userId, LocalDate fromDate, LocalDate toDate) {
        return workoutDayRepository.findByUserIdAndDateBetween(userId, fromDate, toDate);
    }

    public Optional<WorkoutDay> getWorkoutDayById(UUID id) {
        return workoutDayRepository.findById(id);
    }

    public WorkoutDay createWorkoutDay(WorkoutDay workoutDay) {
        workoutDay.setCreatedAt(ZonedDateTime.now());
        workoutDay.setUpdatedAt(ZonedDateTime.now());
        return workoutDayRepository.save(workoutDay);
    }

    public Optional<WorkoutDay> updateWorkoutDay(UUID id, WorkoutDay workoutDay) {
        return workoutDayRepository.findById(id)
                .map(existingWorkoutDay -> {
                    existingWorkoutDay.setUserId(workoutDay.getUserId());
                    existingWorkoutDay.setDate(workoutDay.getDate());
                    existingWorkoutDay.setTitle(workoutDay.getTitle());
                    existingWorkoutDay.setNotes(workoutDay.getNotes());
                    existingWorkoutDay.setUpdatedAt(ZonedDateTime.now());
                    return workoutDayRepository.save(existingWorkoutDay);
                });
    }

    public boolean deleteWorkoutDay(UUID id) {
        if (workoutDayRepository.findById(id).isPresent()) {
            workoutDayRepository.deleteById(id);
            return true;
        }
        return false;
    }
}