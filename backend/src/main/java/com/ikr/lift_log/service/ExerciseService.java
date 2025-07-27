package com.ikr.lift_log.service;

import com.ikr.lift_log.controller.dto.ExerciseResponse;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.model.MuscleGroup;
import com.ikr.lift_log.domain.repository.ExerciseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final MuscleGroupService muscleGroupService;

    public ExerciseService(ExerciseRepository exerciseRepository, MuscleGroupService muscleGroupService) {
        this.exerciseRepository = exerciseRepository;
        this.muscleGroupService = muscleGroupService;
    }

    public List<Exercise> getExercisesByUserId(UUID userId) {
        return exerciseRepository.findByUserId(userId);
    }

    public List<ExerciseResponse> getExerciseResponsesByUserId(UUID userId) {
        List<Exercise> exercises = exerciseRepository.findByUserId(userId);
        return exercises.stream()
                .map(this::convertToExerciseResponse)
                .collect(Collectors.toList());
    }

    private ExerciseResponse convertToExerciseResponse(Exercise exercise) {
        String muscleGroupName = null;
        if (exercise.getMuscleGroupId() != null) {
            Optional<MuscleGroup> muscleGroup = muscleGroupService.getMuscleGroupById(exercise.getMuscleGroupId());
            muscleGroupName = muscleGroup.map(MuscleGroup::getName).orElse(null);
        }
        
        return new ExerciseResponse(
                exercise.getId(),
                exercise.getName(),
                exercise.getDescription(),
                exercise.getMuscleGroupId(),
                muscleGroupName,
                exercise.getCreatedAt()
        );
    }

    public Optional<Exercise> getExerciseById(UUID id) {
        return exerciseRepository.findById(id);
    }

    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    public ExerciseResponse createExerciseResponse(Exercise exercise) {
        Exercise savedExercise = exerciseRepository.save(exercise);
        return convertToExerciseResponse(savedExercise);
    }

    public Exercise updateExercise(UUID id, Exercise exercise) {
        return exerciseRepository.update(id, exercise);
    }

    public void deleteExercise(UUID id) {
        exerciseRepository.deleteById(id);
    }
}