package com.ikr.lift_log.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.config.TestSecurityConfig;
import com.ikr.lift_log.controller.dto.WorkoutSetRequest;
import com.ikr.lift_log.domain.model.WorkoutSet;
import com.ikr.lift_log.infrastructure.repository.JdbcWorkoutSetRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkoutSetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JdbcWorkoutSetRepository workoutSetRepository;

    // ここにテストケースを追加していく

    @Test
    void getWorkoutSetsByWorkoutRecordId_データが存在する場合_リストを返す() throws Exception {
        UUID workoutRecordId = UUID.randomUUID();
        when(workoutSetRepository.findByWorkoutRecordId(workoutRecordId)).thenReturn(List.of(new WorkoutSet()));
        mockMvc.perform(get("/api/workout-records/{workoutRecordId}/workout-sets", workoutRecordId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getWorkoutSetById_指定したIDのデータが存在する場合_データを返す() throws Exception {
        UUID id = UUID.randomUUID();
        when(workoutSetRepository.findById(id)).thenReturn(Optional.of(new WorkoutSet()));

        mockMvc.perform(get("/api/workout-sets/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void createWorkoutSet_新しいデータを作成する() throws Exception {
        UUID workoutRecordId = UUID.randomUUID();
        WorkoutSetRequest request = new WorkoutSetRequest(10, "100.0");
        WorkoutSet created = new WorkoutSet();
        created.setId(UUID.randomUUID());
        when(workoutSetRepository.save(any(WorkoutSet.class))).thenReturn(created);

        mockMvc.perform(post("/api/workout-records/{workoutRecordId}/workout-sets", workoutRecordId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void updateWorkoutSet_データを更新する() throws Exception {
        UUID id = UUID.randomUUID();
        WorkoutSetRequest request = new WorkoutSetRequest(12, "120.0");
        WorkoutSet updated = new WorkoutSet();
        updated.setId(id);
        when(workoutSetRepository.findById(id)).thenReturn(Optional.of(new WorkoutSet()));
        when(workoutSetRepository.save(any(WorkoutSet.class))).thenReturn(updated);

        mockMvc.perform(put("/api/workout-sets/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteWorkoutSet_データを削除する() throws Exception {
        UUID id = UUID.randomUUID();
        when(workoutSetRepository.findById(id)).thenReturn(Optional.of(new WorkoutSet()));
        doNothing().when(workoutSetRepository).deleteById(id);

        mockMvc.perform(delete("/api/workout-sets/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteWorkoutSet_データが存在しない場合_404を返す() throws Exception {
        UUID id = UUID.randomUUID();
        when(workoutSetRepository.findById(id)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/workout-sets/{id}", id))
                .andExpect(status().isNotFound());
    }
}
