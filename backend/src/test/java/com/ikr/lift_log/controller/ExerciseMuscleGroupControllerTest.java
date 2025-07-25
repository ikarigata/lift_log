package com.ikr.lift_log.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.config.TestSecurityConfig;
import com.ikr.lift_log.service.ExerciseMuscleGroupService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.ikr.lift_log.controller.dto.ExerciseMuscleGroupRequest;
import com.ikr.lift_log.domain.model.ExerciseMuscleGroup;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ExerciseMuscleGroupController.class)
@Import(TestSecurityConfig.class)
public class ExerciseMuscleGroupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExerciseMuscleGroupService exerciseMuscleGroupService;

    // ここにテストケースを追加していく

    @Test
    void getMuscleGroupsByExerciseId_紐づくデータが存在する場合_リストを返す() throws Exception {
        UUID exerciseId = UUID.randomUUID();
        when(exerciseMuscleGroupService.getMuscleGroupsByExerciseId(exerciseId)).thenReturn(List.of(new ExerciseMuscleGroup()));

        mockMvc.perform(get("/api/v1/exercises/{exerciseId}/muscle-groups", exerciseId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void addMuscleGroupToExercise_紐付けを登録する() throws Exception {
        UUID exerciseId = UUID.randomUUID();
        UUID muscleGroupId = UUID.randomUUID();
        ExerciseMuscleGroupRequest request = new ExerciseMuscleGroupRequest(muscleGroupId, true);
        ExerciseMuscleGroup created = new ExerciseMuscleGroup();
        created.setId(UUID.randomUUID());

        when(exerciseMuscleGroupService.addMuscleGroupToExercise(any(ExerciseMuscleGroup.class))).thenReturn(created);

        mockMvc.perform(post("/api/v1/exercises/{exerciseId}/muscle-groups", exerciseId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void removeExerciseMuscleGroup_紐付けを削除する() throws Exception {
        UUID exerciseId = UUID.randomUUID();
        UUID id = UUID.randomUUID();
        when(exerciseMuscleGroupService.deleteExerciseMuscleGroup(id)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/exercises/{exerciseId}/muscle-groups/{id}", exerciseId, id))
                .andExpect(status().isNoContent());
    }

    @Test
    void removeExerciseMuscleGroup_紐付けが存在しない場合_404を返す() throws Exception {
        UUID exerciseId = UUID.randomUUID();
        UUID id = UUID.randomUUID();
        when(exerciseMuscleGroupService.deleteExerciseMuscleGroup(id)).thenReturn(false);

        mockMvc.perform(delete("/api/v1/exercises/{exerciseId}/muscle-groups/{id}", exerciseId, id))
                .andExpect(status().isNotFound());
    }
}
