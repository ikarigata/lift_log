package com.ikr.lift_log.service;

import com.ikr.lift_log.domain.model.WorkoutSet;
import com.ikr.lift_log.domain.repository.WorkoutSetRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WorkoutSetService {

    private final WorkoutSetRepository workoutSetRepository;

    public WorkoutSetService(WorkoutSetRepository workoutSetRepository) {
        this.workoutSetRepository = workoutSetRepository;
    }

    public List<WorkoutSet> getWorkoutSetsByWorkoutRecordId(UUID workoutRecordId) {
        return workoutSetRepository.findByWorkoutRecordId(workoutRecordId);
    }

    public Optional<WorkoutSet> getWorkoutSetById(UUID id) {
        return workoutSetRepository.findById(id);
    }

    public WorkoutSet createWorkoutSet(WorkoutSet workoutSet) {
        workoutSet.setCreatedAt(ZonedDateTime.now());
        workoutSet.setUpdatedAt(ZonedDateTime.now());
        return workoutSetRepository.save(workoutSet);
    }

    public Optional<WorkoutSet> updateWorkoutSet(UUID id, WorkoutSet workoutSet) {
        return workoutSetRepository.findById(id)
                .map(existingSet -> {
                    existingSet.setWorkoutRecordId(workoutSet.getWorkoutRecordId());
                    existingSet.setReps(workoutSet.getReps());
                    existingSet.setWeight(workoutSet.getWeight());
                    existingSet.setUpdatedAt(ZonedDateTime.now());
                    return workoutSetRepository.save(existingSet);
                });
    }

    public boolean deleteWorkoutSet(UUID id) {
        if (workoutSetRepository.findById(id).isPresent()) {
            workoutSetRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void deleteWorkoutSetsByWorkoutRecordId(UUID workoutRecordId) {
        List<WorkoutSet> sets = workoutSetRepository.findByWorkoutRecordId(workoutRecordId);
        for (WorkoutSet set : sets) {
            workoutSetRepository.deleteById(set.getId());
        }
    }
}