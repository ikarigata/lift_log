package com.ikr.lift_log.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.service.ExerciseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.ikr.lift_log.config.TestSecurityConfig;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.http.MediaType;

import com.ikr.lift_log.controller.dto.ExerciseRequest;

@WebMvcTest(ExerciseController.class)
@Import(TestSecurityConfig.class)
public class ExerciseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExerciseService exerciseService;

    // ここにテストケースを追加していく
    @Test
    void getAllExercises_演習が登録されていない場合_空のリストを返す() throws Exception {
        when(exerciseService.getAllExercises()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/exercises"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getAllExercises_演習が登録されている場合_演習のリストを返す() throws Exception {
        Exercise exercise1 = new Exercise(UUID.randomUUID(), "test-exercise-1", "test-description-1", ZonedDateTime.now());
        Exercise exercise2 = new Exercise(UUID.randomUUID(), "test-exercise-2", "test-description-2", ZonedDateTime.now());
        when(exerciseService.getAllExercises()).thenReturn(List.of(exercise1, exercise2));

        mockMvc.perform(get("/api/v1/exercises"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("test-exercise-1")))
                .andExpect(jsonPath("$[1].name", is("test-exercise-2")));
    }

    @Test
    void getExerciseById_指定したIDの演習が存在しない場合_404を返す() throws Exception {
        UUID id = UUID.randomUUID();
        when(exerciseService.getExerciseById(id)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/exercises/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void getExerciseById_指定したIDの演習が存在する場合_演習を返す() throws Exception {
        UUID id = UUID.randomUUID();
        Exercise exercise = new Exercise(id, "test-exercise", "test-description", ZonedDateTime.now());
        when(exerciseService.getExerciseById(id)).thenReturn(Optional.of(exercise));

        mockMvc.perform(get("/api/v1/exercises/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(id.toString())))
                .andExpect(jsonPath("$.name", is("test-exercise")));
    }

    @Test
    void createExercise_新しい演習を作成する() throws Exception {
        ExerciseRequest request = new ExerciseRequest("new-exercise", "new-description");
        Exercise createdExercise = new Exercise(UUID.randomUUID(), "new-exercise", "new-description", ZonedDateTime.now());

        when(exerciseService.createExercise(any(Exercise.class))).thenReturn(createdExercise);

        mockMvc.perform(post("/api/v1/exercises")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("new-exercise")));
    }

    @Test
    void updateExercise_指定したIDの演習が存在しない場合_404を返す() throws Exception {
        UUID id = UUID.randomUUID();
        ExerciseRequest request = new ExerciseRequest("updated-exercise", "updated-description");

        when(exerciseService.updateExercise(eq(id), any(Exercise.class))).thenThrow(new RuntimeException());

        mockMvc.perform(put("/api/v1/exercises/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateExercise_指定したIDの演習が存在する場合_演習を更新する() throws Exception {
        UUID id = UUID.randomUUID();
        ExerciseRequest request = new ExerciseRequest("updated-exercise", "updated-description");
        Exercise updatedExercise = new Exercise(id, "updated-exercise", "updated-description", ZonedDateTime.now());

        when(exerciseService.updateExercise(eq(id), any(Exercise.class))).thenReturn(updatedExercise);

        mockMvc.perform(put("/api/v1/exercises/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("updated-exercise")));
    }

    @Test
    void deleteExercise_指定したIDの演習が存在しない場合_404を返す() throws Exception {
        UUID id = UUID.randomUUID();

        doThrow(new RuntimeException()).when(exerciseService).deleteExercise(id);

        mockMvc.perform(delete("/api/v1/exercises/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteExercise_指定したIDの演習が存在する場合_演習を削除する() throws Exception {
        UUID id = UUID.randomUUID();

        doNothing().when(exerciseService).deleteExercise(id);

        mockMvc.perform(delete("/api/v1/exercises/{id}", id))
                .andExpect(status().isNoContent());
    }
}
