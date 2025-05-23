package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.ExerciseRequest;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.service.ExerciseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid; // For @Valid if request body validation is added
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises() {
        List<Exercise> exercises = exerciseService.getAllExercises();
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable UUID id) {
        return exerciseService.getExerciseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercise> updateExercise(
            @PathVariable UUID id,
            @RequestBody @Valid ExerciseRequest exerciseRequest) { // Added @Valid for potential future validation
        Exercise updatedExercise = exerciseService.updateExercise(id, exerciseRequest);
        return ResponseEntity.ok(updatedExercise);
    }
}