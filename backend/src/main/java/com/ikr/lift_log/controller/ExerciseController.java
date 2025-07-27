package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.ExerciseRequest;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.security.AuthenticationUtil;
import com.ikr.lift_log.service.ExerciseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public ResponseEntity<List<Exercise>> getExercisesByUserId() {
        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        
        List<Exercise> exercises = exerciseService.getExercisesByUserId(userId);
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable UUID id) {
        return exerciseService.getExerciseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Exercise> createExercise(@RequestBody ExerciseRequest request) {
        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        
        Exercise exercise = new Exercise();
        exercise.setUserId(userId);
        exercise.setName(request.getName());
        exercise.setDescription(request.getDescription());
        
        // muscleGroupIdをUUIDとして設定
        if (request.getMuscleGroupId() != null && !request.getMuscleGroupId().trim().isEmpty()) {
            try {
                exercise.setMuscleGroupId(UUID.fromString(request.getMuscleGroupId()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid muscle group ID format: " + request.getMuscleGroupId());
            }
        }
        
        Exercise createdExercise = exerciseService.createExercise(exercise);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExercise);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable UUID id, @RequestBody ExerciseRequest request) {
        try {
            // 認証されたユーザーIDを取得
            UUID userId = AuthenticationUtil.requireCurrentUserUUID();
            
            Exercise exercise = new Exercise();
            exercise.setUserId(userId);
            exercise.setName(request.getName());
            exercise.setDescription(request.getDescription());
            
            // muscleGroupIdをUUIDとして設定
            if (request.getMuscleGroupId() != null && !request.getMuscleGroupId().trim().isEmpty()) {
                try {
                    exercise.setMuscleGroupId(UUID.fromString(request.getMuscleGroupId()));
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Invalid muscle group ID format: " + request.getMuscleGroupId());
                }
            }
            
            Exercise updatedExercise = exerciseService.updateExercise(id, exercise);
            return ResponseEntity.ok(updatedExercise);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable UUID id) {
        try {
            exerciseService.deleteExercise(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}