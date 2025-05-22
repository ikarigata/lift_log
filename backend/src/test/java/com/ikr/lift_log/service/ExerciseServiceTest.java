package com.ikr.lift_log.service;

import com.ikr.lift_log.controller.dto.ExerciseRequest;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.model.ExerciseMuscleGroup;
import com.ikr.lift_log.domain.model.MuscleGroup;
import com.ikr.lift_log.domain.repository.ExerciseMuscleGroupRepository;
import com.ikr.lift_log.domain.repository.ExerciseRepository;
import com.ikr.lift_log.domain.repository.MuscleGroupRepository;
import com.ikr.lift_log.service.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ExerciseServiceTest {

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private ExerciseMuscleGroupRepository exerciseMuscleGroupRepository;

    @Mock
    private MuscleGroupRepository muscleGroupRepository;

    @InjectMocks
    private ExerciseService exerciseService;

    private UUID exerciseId;
    private Exercise existingExercise;
    private ExerciseRequest exerciseRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        exerciseId = UUID.randomUUID();

        existingExercise = new Exercise();
        existingExercise.setId(exerciseId);
        existingExercise.setName("Old Name");
        existingExercise.setDescription("Old Description");
        existingExercise.setCreatedAt(ZonedDateTime.now());

        exerciseRequest = new ExerciseRequest();
        exerciseRequest.setName("New Name");
        exerciseRequest.setDescription("New Description");
    }

    @Test
    void testUpdateExercise_Success_NameDescriptionOnly() {
        when(exerciseRepository.findById(exerciseId)).thenReturn(Optional.of(existingExercise));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(existingExercise);
        exerciseRequest.setMuscleGroups(Collections.emptyList());

        Exercise updatedExercise = exerciseService.updateExercise(exerciseId, exerciseRequest);

        assertNotNull(updatedExercise);
        assertEquals("New Name", updatedExercise.getName());
        assertEquals("New Description", updatedExercise.getDescription());
        verify(exerciseRepository, times(1)).findById(exerciseId);
        verify(exerciseMuscleGroupRepository, times(1)).deleteByExerciseId(exerciseId);
        verify(exerciseMuscleGroupRepository, never()).save(any());
        verify(exerciseRepository, times(1)).save(existingExercise);
    }

    @Test
    void testUpdateExercise_Success_AddMuscleGroups() {
        UUID muscleGroupId1 = UUID.randomUUID();
        MuscleGroup mg1 = new MuscleGroup(muscleGroupId1, "Chest", ZonedDateTime.now());
        ExerciseRequest.ExerciseMuscleGroupItemRequest item1 = new ExerciseRequest.ExerciseMuscleGroupItemRequest(muscleGroupId1, true);

        exerciseRequest.setMuscleGroups(List.of(item1));

        when(exerciseRepository.findById(exerciseId)).thenReturn(Optional.of(existingExercise));
        when(muscleGroupRepository.findById(muscleGroupId1)).thenReturn(Optional.of(mg1));
        when(exerciseMuscleGroupRepository.save(any(ExerciseMuscleGroup.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(existingExercise);

        Exercise updatedExercise = exerciseService.updateExercise(exerciseId, exerciseRequest);

        assertNotNull(updatedExercise);
        verify(exerciseMuscleGroupRepository, times(1)).deleteByExerciseId(exerciseId);
        
        ArgumentCaptor<ExerciseMuscleGroup> emgCaptor = ArgumentCaptor.forClass(ExerciseMuscleGroup.class);
        verify(exerciseMuscleGroupRepository, times(1)).save(emgCaptor.capture());
        
        ExerciseMuscleGroup savedEmg = emgCaptor.getValue();
        assertEquals(exerciseId, savedEmg.getExerciseId());
        assertEquals(muscleGroupId1, savedEmg.getMuscleGroupId());
        assertTrue(savedEmg.isPrimary());
        
        verify(exerciseRepository, times(1)).save(existingExercise);
    }

    @Test
    void testUpdateExercise_Success_ChangeMuscleGroups() {
        UUID oldMuscleGroupId = UUID.randomUUID(); // Assume this was an old one, now removed by deleteByExerciseId
        UUID newMuscleGroupId1 = UUID.randomUUID();
        UUID newMuscleGroupId2 = UUID.randomUUID();

        MuscleGroup mg1 = new MuscleGroup(newMuscleGroupId1, "Back", ZonedDateTime.now());
        MuscleGroup mg2 = new MuscleGroup(newMuscleGroupId2, "Biceps", ZonedDateTime.now());

        ExerciseRequest.ExerciseMuscleGroupItemRequest item1 = new ExerciseRequest.ExerciseMuscleGroupItemRequest(newMuscleGroupId1, true);
        ExerciseRequest.ExerciseMuscleGroupItemRequest item2 = new ExerciseRequest.ExerciseMuscleGroupItemRequest(newMuscleGroupId2, false);
        exerciseRequest.setMuscleGroups(List.of(item1, item2));

        when(exerciseRepository.findById(exerciseId)).thenReturn(Optional.of(existingExercise));
        when(muscleGroupRepository.findById(newMuscleGroupId1)).thenReturn(Optional.of(mg1));
        when(muscleGroupRepository.findById(newMuscleGroupId2)).thenReturn(Optional.of(mg2));
        when(exerciseMuscleGroupRepository.save(any(ExerciseMuscleGroup.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(existingExercise);

        exerciseService.updateExercise(exerciseId, exerciseRequest);

        verify(exerciseMuscleGroupRepository, times(1)).deleteByExerciseId(exerciseId);
        
        ArgumentCaptor<ExerciseMuscleGroup> emgCaptor = ArgumentCaptor.forClass(ExerciseMuscleGroup.class);
        verify(exerciseMuscleGroupRepository, times(2)).save(emgCaptor.capture());
        
        List<ExerciseMuscleGroup> savedEmgs = emgCaptor.getAllValues();
        assertTrue(savedEmgs.stream().anyMatch(emg -> emg.getMuscleGroupId().equals(newMuscleGroupId1) && emg.isPrimary()));
        assertTrue(savedEmgs.stream().anyMatch(emg -> emg.getMuscleGroupId().equals(newMuscleGroupId2) && !emg.isPrimary()));
        
        verify(exerciseRepository, times(1)).save(existingExercise);
    }
    
    @Test
    void testUpdateExercise_Success_ChangePrimaryMuscleGroup() {
        UUID muscleGroupId1 = UUID.randomUUID();
        UUID muscleGroupId2 = UUID.randomUUID();
        MuscleGroup mg1 = new MuscleGroup(muscleGroupId1, "Shoulders", ZonedDateTime.now());
        MuscleGroup mg2 = new MuscleGroup(muscleGroupId2, "Triceps", ZonedDateTime.now());

        // Initially, mg1 is primary
        ExerciseRequest.ExerciseMuscleGroupItemRequest item1Old = new ExerciseRequest.ExerciseMuscleGroupItemRequest(muscleGroupId1, true);
        ExerciseRequest.ExerciseMuscleGroupItemRequest item2Old = new ExerciseRequest.ExerciseMuscleGroupItemRequest(muscleGroupId2, false);
        // No need to set this in request, this is just for conceptual old state. The update will set the new state.

        // Now, mg2 becomes primary
        ExerciseRequest.ExerciseMuscleGroupItemRequest item1New = new ExerciseRequest.ExerciseMuscleGroupItemRequest(muscleGroupId1, false);
        ExerciseRequest.ExerciseMuscleGroupItemRequest item2New = new ExerciseRequest.ExerciseMuscleGroupItemRequest(muscleGroupId2, true);
        exerciseRequest.setMuscleGroups(List.of(item1New, item2New));

        when(exerciseRepository.findById(exerciseId)).thenReturn(Optional.of(existingExercise));
        when(muscleGroupRepository.findById(muscleGroupId1)).thenReturn(Optional.of(mg1));
        when(muscleGroupRepository.findById(muscleGroupId2)).thenReturn(Optional.of(mg2));
        when(exerciseMuscleGroupRepository.save(any(ExerciseMuscleGroup.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(existingExercise);

        exerciseService.updateExercise(exerciseId, exerciseRequest);

        ArgumentCaptor<ExerciseMuscleGroup> emgCaptor = ArgumentCaptor.forClass(ExerciseMuscleGroup.class);
        verify(exerciseMuscleGroupRepository, times(2)).save(emgCaptor.capture());
        List<ExerciseMuscleGroup> capturedEmgs = emgCaptor.getAllValues();

        ExerciseMuscleGroup emgForMg1 = capturedEmgs.stream().filter(e -> e.getMuscleGroupId().equals(muscleGroupId1)).findFirst().orElse(null);
        ExerciseMuscleGroup emgForMg2 = capturedEmgs.stream().filter(e -> e.getMuscleGroupId().equals(muscleGroupId2)).findFirst().orElse(null);

        assertNotNull(emgForMg1);
        assertFalse(emgForMg1.isPrimary());
        assertNotNull(emgForMg2);
        assertTrue(emgForMg2.isPrimary());
    }


    @Test
    void testUpdateExercise_Success_RemoveAllMuscleGroups() {
        // Assume exercise previously had muscle groups, they will be cleared by deleteByExerciseId
        exerciseRequest.setMuscleGroups(new ArrayList<>()); // Empty list

        when(exerciseRepository.findById(exerciseId)).thenReturn(Optional.of(existingExercise));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(existingExercise);

        Exercise updatedExercise = exerciseService.updateExercise(exerciseId, exerciseRequest);

        assertNotNull(updatedExercise);
        verify(exerciseMuscleGroupRepository, times(1)).deleteByExerciseId(exerciseId);
        verify(exerciseMuscleGroupRepository, never()).save(any(ExerciseMuscleGroup.class));
        verify(exerciseRepository, times(1)).save(existingExercise);
    }
    
    @Test
    void testUpdateExercise_Success_NullMuscleGroupsList() {
        // This tests if muscleGroups list in request is null (not just empty)
        exerciseRequest.setMuscleGroups(null); 

        when(exerciseRepository.findById(exerciseId)).thenReturn(Optional.of(existingExercise));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(existingExercise);

        Exercise updatedExercise = exerciseService.updateExercise(exerciseId, exerciseRequest);

        assertNotNull(updatedExercise);
        assertEquals("New Name", updatedExercise.getName());
        verify(exerciseMuscleGroupRepository, times(1)).deleteByExerciseId(exerciseId);
        verify(exerciseMuscleGroupRepository, never()).save(any(ExerciseMuscleGroup.class));
        verify(exerciseRepository, times(1)).save(existingExercise);
    }


    @Test
    void testUpdateExercise_Error_ExerciseNotFound() {
        when(exerciseRepository.findById(exerciseId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            exerciseService.updateExercise(exerciseId, exerciseRequest);
        });

        assertEquals("Exercise not found with id: " + exerciseId, exception.getMessage());
        verify(exerciseMuscleGroupRepository, never()).deleteByExerciseId(any());
        verify(exerciseMuscleGroupRepository, never()).save(any());
        verify(exerciseRepository, never()).save(any());
    }

    @Test
    void testUpdateExercise_Error_MuscleGroupNotFound() {
        UUID muscleGroupId1 = UUID.randomUUID();
        ExerciseRequest.ExerciseMuscleGroupItemRequest item1 = new ExerciseRequest.ExerciseMuscleGroupItemRequest(muscleGroupId1, true);
        exerciseRequest.setMuscleGroups(List.of(item1));

        when(exerciseRepository.findById(exerciseId)).thenReturn(Optional.of(existingExercise));
        when(muscleGroupRepository.findById(muscleGroupId1)).thenReturn(Optional.empty()); // Muscle group not found

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            exerciseService.updateExercise(exerciseId, exerciseRequest);
        });

        assertEquals("MuscleGroup not found with id: " + muscleGroupId1, exception.getMessage());
        // deleteByExerciseId should still be called as it's before the loop
        verify(exerciseMuscleGroupRepository, times(1)).deleteByExerciseId(exerciseId);
        verify(exerciseMuscleGroupRepository, never()).save(any(ExerciseMuscleGroup.class)); // Save for association should not happen
        verify(exerciseRepository, never()).save(any(Exercise.class)); // Save for exercise should not happen
    }
}
