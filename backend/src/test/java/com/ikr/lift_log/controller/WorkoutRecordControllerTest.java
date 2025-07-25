package com.ikr.lift_log.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.config.TestSecurityConfig;
import com.ikr.lift_log.controller.dto.WorkoutRecordRequest;
import com.ikr.lift_log.domain.model.WorkoutRecord;
import com.ikr.lift_log.infrastructure.repository.JdbcWorkoutRecordRepository;
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
public class WorkoutRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JdbcWorkoutRecordRepository workoutRecordRepository;

    // ここにテストケースを追加していく

    @Test
    void getWorkoutRecordsByWorkoutDayId_データが存在する場合_リストを返す() throws Exception {
        UUID workoutDayId = UUID.randomUUID();
        when(workoutRecordRepository.findByWorkoutDayId(workoutDayId)).thenReturn(List.of(new WorkoutRecord()));
        mockMvc.perform(get("/api/workout-days/{workoutDayId}/workout-records", workoutDayId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getWorkoutRecordById_指定したIDのデータが存在する場合_データを返す() throws Exception {
        UUID id = UUID.randomUUID();
        when(workoutRecordRepository.findById(id)).thenReturn(Optional.of(new WorkoutRecord()));

        mockMvc.perform(get("/api/workout-records/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void createWorkoutRecord_新しいデータを作成する() throws Exception {
        UUID workoutDayId = UUID.randomUUID();
        WorkoutRecordRequest request = new WorkoutRecordRequest(UUID.randomUUID(), "test");
        WorkoutRecord created = new WorkoutRecord();
        created.setId(UUID.randomUUID());
        when(workoutRecordRepository.save(any(WorkoutRecord.class))).thenReturn(created);

        mockMvc.perform(post("/api/workout-days/{workoutDayId}/workout-records", workoutDayId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void updateWorkoutRecord_データを更新する() throws Exception {
        UUID id = UUID.randomUUID();
        WorkoutRecordRequest request = new WorkoutRecordRequest(UUID.randomUUID(), "test");
        WorkoutRecord updated = new WorkoutRecord();
        updated.setId(id);
        when(workoutRecordRepository.findById(id)).thenReturn(Optional.of(new WorkoutRecord()));
        when(workoutRecordRepository.save(any(WorkoutRecord.class))).thenReturn(updated);

        mockMvc.perform(put("/api/workout-records/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteWorkoutRecord_データを削除する() throws Exception {
        UUID id = UUID.randomUUID();
        when(workoutRecordRepository.findById(id)).thenReturn(Optional.of(new WorkoutRecord()));
        doNothing().when(workoutRecordRepository).deleteById(id);

        mockMvc.perform(delete("/api/workout-records/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteWorkoutRecord_データが存在しない場合_404を返す() throws Exception {
        UUID id = UUID.randomUUID();
        when(workoutRecordRepository.findById(id)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/workout-records/{id}", id))
                .andExpect(status().isNotFound());
    }
}
