package com.ikr.lift_log.controller;

import com.ikr.lift_log.domain.model.ExerciseMuscleGroup;
import com.ikr.lift_log.service.ExerciseMuscleGroupService;
import com.ikr.lift_log.controller.dto.ExerciseMuscleGroupRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exercises/{exerciseId}/muscle-groups")
public class ExerciseMuscleGroupController {

    private final ExerciseMuscleGroupService exerciseMuscleGroupService;

    public ExerciseMuscleGroupController(ExerciseMuscleGroupService exerciseMuscleGroupService) {
        this.exerciseMuscleGroupService = exerciseMuscleGroupService;
    }

    @GetMapping
    public ResponseEntity<List<ExerciseMuscleGroup>> getMuscleGroupsByExerciseId(@PathVariable UUID exerciseId) {
        List<ExerciseMuscleGroup> muscleGroups = exerciseMuscleGroupService.getMuscleGroupsByExerciseId(exerciseId);
        return ResponseEntity.ok(muscleGroups);
    }

    @PostMapping
    public ResponseEntity<ExerciseMuscleGroup> addMuscleGroupToExercise(
            @PathVariable UUID exerciseId,
            @RequestBody ExerciseMuscleGroupRequest request) {

        ExerciseMuscleGroup exerciseMuscleGroup = new ExerciseMuscleGroup();
        exerciseMuscleGroup.setExerciseId(exerciseId);
        exerciseMuscleGroup.setMuscleGroupId(request.getMuscleGroupId());
        exerciseMuscleGroup.setPrimary(request.isPrimary());

        ExerciseMuscleGroup createdRel = exerciseMuscleGroupService.addMuscleGroupToExercise(exerciseMuscleGroup);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdRel.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdRel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeExerciseMuscleGroup(@PathVariable UUID exerciseId, @PathVariable UUID id) {
        if (exerciseMuscleGroupService.deleteExerciseMuscleGroup(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}