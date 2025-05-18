package com.ikr.lift_log.service;

import com.ikr.lift_log.domain.model.MuscleGroup;
import com.ikr.lift_log.domain.repository.MuscleGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MuscleGroupService {

    private final MuscleGroupRepository muscleGroupRepository;

    public MuscleGroupService(MuscleGroupRepository muscleGroupRepository) {
        this.muscleGroupRepository = muscleGroupRepository;
    }

    public List<MuscleGroup> getAllMuscleGroups() {
        return muscleGroupRepository.findAll();
    }

    public Optional<MuscleGroup> getMuscleGroupById(UUID id) {
        return muscleGroupRepository.findById(id);
    }

    public MuscleGroup createMuscleGroup(MuscleGroup muscleGroup) {
        return muscleGroupRepository.save(muscleGroup);
    }

    public Optional<MuscleGroup> updateMuscleGroup(UUID id, MuscleGroup muscleGroup) {
        return muscleGroupRepository.findById(id)
                .map(existingMuscleGroup -> {
                    existingMuscleGroup.setName(muscleGroup.getName());
                    return muscleGroupRepository.save(existingMuscleGroup);
                });
    }
}