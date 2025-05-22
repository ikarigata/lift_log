package com.ikr.lift_log.service;

import com.ikr.lift_log.controller.dto.ExerciseRequest;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.model.ExerciseMuscleGroup;
import com.ikr.lift_log.domain.repository.ExerciseMuscleGroupRepository;
import com.ikr.lift_log.domain.repository.ExerciseRepository;
import com.ikr.lift_log.domain.repository.MuscleGroupRepository;
import com.ikr.lift_log.service.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMuscleGroupRepository exerciseMuscleGroupRepository;
    private final MuscleGroupRepository muscleGroupRepository;

    public ExerciseService(ExerciseRepository exerciseRepository,
                           ExerciseMuscleGroupRepository exerciseMuscleGroupRepository,
                           MuscleGroupRepository muscleGroupRepository) {
        this.exerciseRepository = exerciseRepository;
        this.exerciseMuscleGroupRepository = exerciseMuscleGroupRepository;
        this.muscleGroupRepository = muscleGroupRepository;
    }

    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    public Optional<Exercise> getExerciseById(UUID id) {
        return exerciseRepository.findById(id);
    }

    @Transactional
    public Exercise updateExercise(UUID exerciseId, ExerciseRequest exerciseRequest) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found with id: " + exerciseId));

        exercise.setName(exerciseRequest.getName());
        exercise.setDescription(exerciseRequest.getDescription());

        // Update muscle groups
        // 1. Delete existing associations
        exerciseMuscleGroupRepository.deleteByExerciseId(exerciseId);

        // 2. Add new associations if provided
        if (exerciseRequest.getMuscleGroups() != null && !exerciseRequest.getMuscleGroups().isEmpty()) {
            for (ExerciseRequest.ExerciseMuscleGroupItemRequest itemRequest : exerciseRequest.getMuscleGroups()) {
                // Ensure the muscle group exists
                muscleGroupRepository.findById(itemRequest.getMuscleGroupId())
                        .orElseThrow(() -> new ResourceNotFoundException("MuscleGroup not found with id: " + itemRequest.getMuscleGroupId()));

                ExerciseMuscleGroup newAssociation = new ExerciseMuscleGroup();
                newAssociation.setId(UUID.randomUUID()); // Generate new UUID for the association
                newAssociation.setExerciseId(exerciseId);
                newAssociation.setMuscleGroupId(itemRequest.getMuscleGroupId());
                newAssociation.setPrimary(itemRequest.isPrimaryEffective()); // Use the helper method
                exerciseMuscleGroupRepository.save(newAssociation);
            }
        }

        return exerciseRepository.save(exercise);
    }
}