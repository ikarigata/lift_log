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

    // セット情報を含むWorkoutRecordResponseを返すメソッド
    public List<WorkoutRecordResponse> getWorkoutRecordResponsesByUserId(UUID userId) {
        List<WorkoutRecord> workoutRecords = workoutRecordRepository.findByUserId(userId);
        return workoutRecords.stream()
                .map(this::convertToWorkoutRecordResponse)
                .collect(Collectors.toList());
    }

    public List<WorkoutRecordResponse> getWorkoutRecordResponsesByWorkoutDayId(UUID workoutDayId) {
        List<WorkoutRecord> workoutRecords = workoutRecordRepository.findByWorkoutDayId(workoutDayId);
        return workoutRecords.stream()
                .map(this::convertToWorkoutRecordResponse)
                .collect(Collectors.toList());
    }

    private WorkoutRecordResponse convertToWorkoutRecordResponse(WorkoutRecord workoutRecord) {
        // セット情報を取得（存在しない場合は空のリスト）
        List<WorkoutSet> workoutSets = workoutSetService.getWorkoutSetsByWorkoutRecordId(workoutRecord.getId());
        List<WorkoutSetResponse> setResponses = workoutSets.stream()
                .map((WorkoutSet set) -> {
                    int setNumber = workoutSets.indexOf(set) + 1; // インデックスベースでsetNumberを生成
                    double weight = set.getWeight() != null ? set.getWeight().doubleValue() : 0.0;
                    return new WorkoutSetResponse(setNumber, weight, set.getReps(), set.getSubReps());
                })
                .collect(Collectors.toList());

        // エクササイズ名を取得
        String exerciseName = exerciseService.getExerciseById(workoutRecord.getExerciseId())
                .map(Exercise::getName)
                .orElse("");

        return new WorkoutRecordResponse(
                workoutRecord.getId(),
                workoutRecord.getWorkoutDayId(),
                workoutRecord.getExerciseId(),
                exerciseName,
                setResponses, // nullではなく空のリストが保証されている
                workoutRecord.getNotes(),
                workoutRecord.getCreatedAt(),
                workoutRecord.getUpdatedAt()
        );
    }
}