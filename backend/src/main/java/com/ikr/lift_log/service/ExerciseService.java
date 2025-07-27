package com.ikr.lift_log.service;

import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.repository.ExerciseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    public List<Exercise> getExercisesByUserId(UUID userId) {
        return exerciseRepository.findByUserId(userId);
    }

    public Optional<Exercise> getExerciseById(UUID id) {
        return exerciseRepository.findById(id);
    }

    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    public Exercise updateExercise(UUID id, Exercise exercise) {
        return exerciseRepository.update(id, exercise);
    }

    public void deleteExercise(UUID id) {
        exerciseRepository.deleteById(id);
    }
}