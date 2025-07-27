package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.ExerciseRequest;
import com.ikr.lift_log.controller.dto.ExerciseResponse;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.model.MuscleGroup;
import com.ikr.lift_log.security.AuthenticationUtil;
import com.ikr.lift_log.service.ExerciseService;
import com.ikr.lift_log.service.MuscleGroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;
    private final MuscleGroupService muscleGroupService;

    public ExerciseController(ExerciseService exerciseService, MuscleGroupService muscleGroupService) {
        this.exerciseService = exerciseService;
        this.muscleGroupService = muscleGroupService;
    }

    @GetMapping
    public ResponseEntity<List<ExerciseResponse>> getExercisesByUserId() {
        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        
        List<ExerciseResponse> exercises = exerciseService.getExerciseResponsesByUserId(userId);
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable UUID id) {
        return exerciseService.getExerciseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ExerciseResponse> createExercise(@RequestBody ExerciseRequest request) {
        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        
        Exercise exercise = new Exercise();
        exercise.setUserId(userId);
        exercise.setName(request.getName());
        exercise.setDescription(null);
        
        // muscleGroup名からUUIDを取得
        if (request.getMuscleGroup() != null && !request.getMuscleGroup().trim().isEmpty()) {
            Optional<UUID> muscleGroupId = muscleGroupService.getMuscleGroupByName(request.getMuscleGroup())
                    .map(MuscleGroup::getId);
            
            if (muscleGroupId.isPresent()) {
                exercise.setMuscleGroupId(muscleGroupId.get());
            } else {
                throw new RuntimeException("Invalid muscle group name: " + request.getMuscleGroup());
            }
        }
        
        ExerciseResponse createdExercise = exerciseService.createExerciseResponse(exercise);
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
            exercise.setDescription(null);
            
            // muscleGroup名からUUIDを取得
            if (request.getMuscleGroup() != null && !request.getMuscleGroup().trim().isEmpty()) {
                Optional<UUID> muscleGroupId = muscleGroupService.getMuscleGroupByName(request.getMuscleGroup())
                        .map(MuscleGroup::getId);
                
                if (muscleGroupId.isPresent()) {
                    exercise.setMuscleGroupId(muscleGroupId.get());
                } else {
                    throw new RuntimeException("Invalid muscle group name: " + request.getMuscleGroup());
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