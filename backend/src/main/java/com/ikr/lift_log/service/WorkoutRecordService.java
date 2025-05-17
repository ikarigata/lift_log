package com.ikr.lift_log.service;

import com.ikr.lift_log.domain.model.WorkoutRecord;
import com.ikr.lift_log.domain.repository.WorkoutRecordRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WorkoutRecordService {

    private final WorkoutRecordRepository workoutRecordRepository;

    public WorkoutRecordService(WorkoutRecordRepository workoutRecordRepository) {
        this.workoutRecordRepository = workoutRecordRepository;
    }

    public List<WorkoutRecord> getWorkoutRecordsByWorkoutDayId(UUID workoutDayId) {
        return workoutRecordRepository.findByWorkoutDayId(workoutDayId);
    }

    public Optional<WorkoutRecord> getWorkoutRecordById(UUID id) {
        return workoutRecordRepository.findById(id);
    }

    public WorkoutRecord createWorkoutRecord(WorkoutRecord workoutRecord) {
        workoutRecord.setCreatedAt(ZonedDateTime.now());
        workoutRecord.setUpdatedAt(ZonedDateTime.now());
        return workoutRecordRepository.save(workoutRecord);
    }

    public Optional<WorkoutRecord> updateWorkoutRecord(UUID id, WorkoutRecord workoutRecord) {
        return workoutRecordRepository.findById(id)
                .map(existingRecord -> {
                    existingRecord.setWorkoutDayId(workoutRecord.getWorkoutDayId());
                    existingRecord.setExerciseId(workoutRecord.getExerciseId());
                    existingRecord.setNotes(workoutRecord.getNotes());
                    existingRecord.setUpdatedAt(ZonedDateTime.now());
                    return workoutRecordRepository.save(existingRecord);
                });
    }

    public boolean deleteWorkoutRecord(UUID id) {
        if (workoutRecordRepository.findById(id).isPresent()) {
            workoutRecordRepository.deleteById(id);
            return true;
        }
        return false;
    }
}