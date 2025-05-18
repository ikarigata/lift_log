package com.ikr.lift_log.service;

import com.ikr.lift_log.domain.model.ExerciseMuscleGroup;
import com.ikr.lift_log.domain.repository.ExerciseMuscleGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExerciseMuscleGroupService {

    private final ExerciseMuscleGroupRepository exerciseMuscleGroupRepository;

    public ExerciseMuscleGroupService(ExerciseMuscleGroupRepository exerciseMuscleGroupRepository) {
        this.exerciseMuscleGroupRepository = exerciseMuscleGroupRepository;
    }

    public List<ExerciseMuscleGroup> getMuscleGroupsByExerciseId(UUID exerciseId) {
        return exerciseMuscleGroupRepository.findByExerciseId(exerciseId);
    }

    public Optional<ExerciseMuscleGroup> getExerciseMuscleGroupById(UUID id) {
        return exerciseMuscleGroupRepository.findById(id);
    }

    public ExerciseMuscleGroup addMuscleGroupToExercise(ExerciseMuscleGroup exerciseMuscleGroup) {
        return exerciseMuscleGroupRepository.save(exerciseMuscleGroup);
    }

    public Optional<ExerciseMuscleGroup> updateExerciseMuscleGroup(UUID id, ExerciseMuscleGroup exerciseMuscleGroup) {
        return exerciseMuscleGroupRepository.findById(id)
                .map(existingRel -> {
                    existingRel.setExerciseId(exerciseMuscleGroup.getExerciseId());
                    existingRel.setMuscleGroupId(exerciseMuscleGroup.getMuscleGroupId());
                    existingRel.setPrimary(exerciseMuscleGroup.isPrimary());
                    return exerciseMuscleGroupRepository.save(existingRel);
                });
    }

    public boolean deleteExerciseMuscleGroup(UUID id) {
        if (exerciseMuscleGroupRepository.findById(id).isPresent()) {
            exerciseMuscleGroupRepository.deleteById(id);
            return true;
        }
        return false;
    }
}