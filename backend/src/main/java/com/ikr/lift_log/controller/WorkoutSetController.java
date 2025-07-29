package com.ikr.lift_log.controller;

import com.ikr.lift_log.domain.model.WorkoutSet;
import com.ikr.lift_log.service.WorkoutSetService;
import com.ikr.lift_log.controller.dto.WorkoutSetRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class WorkoutSetController {

    private final WorkoutSetService workoutSetService;

    public WorkoutSetController(WorkoutSetService workoutSetService) {
        this.workoutSetService = workoutSetService;
    }

    @GetMapping("/workout-records/{workoutRecordId}/workout-sets")
    public ResponseEntity<List<WorkoutSet>> getWorkoutSetsByWorkoutRecordId(@PathVariable UUID workoutRecordId) {
        List<WorkoutSet> workoutSets = workoutSetService.getWorkoutSetsByWorkoutRecordId(workoutRecordId);
        return ResponseEntity.ok(workoutSets);
    }

    @GetMapping("/workout-sets/{id}")
    public ResponseEntity<WorkoutSet> getWorkoutSetById(@PathVariable UUID id) {
        return workoutSetService.getWorkoutSetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/workout-records/{workoutRecordId}/workout-sets")
    public ResponseEntity<WorkoutSet> createWorkoutSet(
            @PathVariable UUID workoutRecordId,
            @RequestBody WorkoutSetRequest request) {

        WorkoutSet workoutSet = new WorkoutSet();
        workoutSet.setWorkoutRecordId(workoutRecordId);
        workoutSet.setReps(request.getReps());
        workoutSet.setWeight(new BigDecimal(request.getWeight()));

        WorkoutSet createdSet = workoutSetService.createWorkoutSet(workoutSet);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/workout-sets/{id}")
                .buildAndExpand(createdSet.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdSet);
    }

    @PutMapping("/workout-sets/{id}")
    public ResponseEntity<WorkoutSet> updateWorkoutSet(
            @PathVariable UUID id,
            @RequestBody WorkoutSetRequest request) {

        WorkoutSet workoutSet = new WorkoutSet();
        workoutSet.setReps(request.getReps());
        workoutSet.setWeight(new BigDecimal(request.getWeight()));

        return workoutSetService.updateWorkoutSet(id, workoutSet)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/workout-sets/{id}")
    public ResponseEntity<Void> deleteWorkoutSet(@PathVariable UUID id) {
        if (workoutSetService.deleteWorkoutSet(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}