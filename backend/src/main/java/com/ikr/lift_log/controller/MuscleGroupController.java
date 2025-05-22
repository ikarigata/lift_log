package com.ikr.lift_log.controller;

import com.ikr.lift_log.domain.model.MuscleGroup;
import com.ikr.lift_log.service.MuscleGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/muscle-groups")
public class MuscleGroupController {

    private final MuscleGroupService muscleGroupService;

    public MuscleGroupController(MuscleGroupService muscleGroupService) {
        this.muscleGroupService = muscleGroupService;
    }

    @GetMapping
    public ResponseEntity<List<MuscleGroup>> getAllMuscleGroups() {
        List<MuscleGroup> muscleGroups = muscleGroupService.getAllMuscleGroups();
        return ResponseEntity.ok(muscleGroups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MuscleGroup> getMuscleGroupById(@PathVariable UUID id) {
        return muscleGroupService.getMuscleGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MuscleGroup> createMuscleGroup(@RequestBody MuscleGroup muscleGroup) {
        MuscleGroup createdMuscleGroup = muscleGroupService.createMuscleGroup(muscleGroup);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdMuscleGroup.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdMuscleGroup);
    }
}