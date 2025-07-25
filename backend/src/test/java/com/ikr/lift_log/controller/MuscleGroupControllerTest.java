package com.ikr.lift_log.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.config.TestSecurityConfig;
import com.ikr.lift_log.service.MuscleGroupService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.ikr.lift_log.domain.model.MuscleGroup;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MuscleGroupController.class)
@Import(TestSecurityConfig.class)
public class MuscleGroupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MuscleGroupService muscleGroupService;

    // ここにテストケースを追加していく

    @Test
    void getAllMuscleGroups_データが存在する場合_リストを返す() throws Exception {
        when(muscleGroupService.getAllMuscleGroups()).thenReturn(List.of(new MuscleGroup()));

        mockMvc.perform(get("/api/v1/muscle-groups"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getMuscleGroupById_指定したIDのデータが存在する場合_データを返す() throws Exception {
        UUID id = UUID.randomUUID();
        when(muscleGroupService.getMuscleGroupById(id)).thenReturn(Optional.of(new MuscleGroup()));

        mockMvc.perform(get("/api/v1/muscle-groups/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void createMuscleGroup_新しいデータを作成する() throws Exception {
        MuscleGroup muscleGroup = new MuscleGroup();
        muscleGroup.setName("test");
        MuscleGroup created = new MuscleGroup();
        created.setId(UUID.randomUUID());
        when(muscleGroupService.createMuscleGroup(any(MuscleGroup.class))).thenReturn(created);

        mockMvc.perform(post("/api/v1/muscle-groups")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(muscleGroup)))
                .andExpect(status().isCreated());
    }
}
