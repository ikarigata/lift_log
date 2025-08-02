package com.ikr.lift_log.service;

import com.ikr.lift_log.domain.model.WorkoutRecord;
import com.ikr.lift_log.domain.model.WorkoutSet;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.repository.WorkoutRecordRepository;
import com.ikr.lift_log.controller.dto.WorkoutRecordResponse;
import com.ikr.lift_log.controller.dto.WorkoutSetResponse;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class WorkoutRecordService {

    private final WorkoutRecordRepository workoutRecordRepository;
    private final WorkoutSetService workoutSetService;
    private final ExerciseService exerciseService;

    public WorkoutRecordService(WorkoutRecordRepository workoutRecordRepository, 
                               WorkoutSetService workoutSetService,
                               ExerciseService exerciseService) {
        this.workoutRecordRepository = workoutRecordRepository;
        this.workoutSetService = workoutSetService;
        this.exerciseService = exerciseService;
    }

    public List<WorkoutRecord> getAllWorkoutRecords() {
        return workoutRecordRepository.findAll();
    }

    public List<WorkoutRecord> getWorkoutRecordsByUserId(UUID userId) {
        return workoutRecordRepository.findByUserId(userId);
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

    // WorkoutRecordResponseを構築するメソッド群
    public List<WorkoutRecordResponse> getWorkoutRecordResponsesByUserId(UUID userId) {
        List<WorkoutRecord> records = workoutRecordRepository.findByUserId(userId);
        return records.stream()
                .map(this::convertToWorkoutRecordResponse)
                .collect(Collectors.toList());
    }

    public List<WorkoutRecordResponse> getWorkoutRecordResponsesByWorkoutDayId(UUID workoutDayId) {
        List<WorkoutRecord> records = workoutRecordRepository.findByWorkoutDayId(workoutDayId);
        return records.stream()
                .map(this::convertToWorkoutRecordResponse)
                .collect(Collectors.toList());
    }

    public Optional<WorkoutRecordResponse> getWorkoutRecordResponseById(UUID id) {
        return workoutRecordRepository.findById(id)
                .map(this::convertToWorkoutRecordResponse);
    }

    private WorkoutRecordResponse convertToWorkoutRecordResponse(WorkoutRecord record) {
        // 関連するWorkoutSetを取得
        List<WorkoutSet> workoutSets = workoutSetService.getWorkoutSetsByWorkoutRecordId(record.getId());
        List<WorkoutSetResponse> setResponses = IntStream.range(0, workoutSets.size())
                .mapToObj(i -> convertToWorkoutSetResponse(workoutSets.get(i), i + 1))
                .collect(Collectors.toList());

        // 関連するExerciseを取得
        String exerciseName = exerciseService.getExerciseById(record.getExerciseId())
                .map(Exercise::getName)
                .orElse("Unknown Exercise");

        return new WorkoutRecordResponse(
                record.getId(),
                record.getWorkoutDayId(),
                record.getExerciseId(),
                exerciseName,
                setResponses,
                record.getNotes(),
                record.getCreatedAt(),
                record.getUpdatedAt()
        );
    }

    private WorkoutSetResponse convertToWorkoutSetResponse(WorkoutSet set, int setNumber) {
        return new WorkoutSetResponse(
                set.getId(),
                setNumber,
                set.getWeight(),
                set.getReps(),
                set.getSubReps(),
                set.getCreatedAt(),
                set.getUpdatedAt()
        );
    }
}