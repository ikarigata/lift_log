package com.ikr.lift_log.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.config.TestSecurityConfig;
import com.ikr.lift_log.domain.model.WorkoutDay;
import com.ikr.lift_log.infrastructure.repository.JdbcWorkoutDayRepository;
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
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkoutDayControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JdbcWorkoutDayRepository workoutDayRepository;

    // ここにテストケースを追加していく

    @Test
    void getWorkoutDays_パラメータなしの場合_全件取得() throws Exception {
        when(workoutDayRepository.findAll()).thenReturn(List.of(new WorkoutDay()));
        mockMvc.perform(get("/api/v1/workout-days"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getWorkoutDayById_指定したIDのデータが存在する場合_データを返す() throws Exception {
        UUID id = UUID.randomUUID();
        when(workoutDayRepository.findById(id)).thenReturn(Optional.of(new WorkoutDay()));

        mockMvc.perform(get("/api/v1/workout-days/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void createWorkoutDay_新しいデータを作成する() throws Exception {
        WorkoutDay workoutDay = new WorkoutDay();
        workoutDay.setUserId(UUID.randomUUID());
        WorkoutDay created = new WorkoutDay();
        created.setId(UUID.randomUUID());
        when(workoutDayRepository.save(any(WorkoutDay.class))).thenReturn(created);

        mockMvc.perform(post("/api/v1/workout-days")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutDay)))
                .andExpect(status().isCreated());
    }

    @Test
    void updateWorkoutDay_データを更新する() throws Exception {
        UUID id = UUID.randomUUID();
        WorkoutDay workoutDay = new WorkoutDay();
        workoutDay.setUserId(UUID.randomUUID());
        when(workoutDayRepository.save(any(WorkoutDay.class))).thenReturn(workoutDay);
        when(workoutDayRepository.findById(id)).thenReturn(Optional.of(workoutDay));


        mockMvc.perform(put("/api/v1/workout-days/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutDay)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteWorkoutDay_データを削除する() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(workoutDayRepository).deleteById(id);
        when(workoutDayRepository.findById(id)).thenReturn(Optional.of(new WorkoutDay())); // to make the service return true

        mockMvc.perform(delete("/api/v1/workout-days/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteWorkoutDay_データが存在しない場合_404を返す() throws Exception {
        UUID id = UUID.randomUUID();
        when(workoutDayRepository.findById(id)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/v1/workout-days/{id}", id))
                .andExpect(status().isNotFound());
    }
}
