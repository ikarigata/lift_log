package com.ikr.lift_log.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.config.TestSecurityConfig;
import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.infrastructure.repository.JdbcUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
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

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JdbcUserRepository userRepository;

    // ここにテストケースを追加していく

    @Test
    void getAllUsers_データが存在する場合_リストを返す() throws Exception {
        when(userRepository.findAll()).thenReturn(List.of(new User()));

        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getUserById_指定したIDのデータが存在する場合_データを返す() throws Exception {
        UUID id = UUID.randomUUID();
        when(userRepository.findById(id)).thenReturn(Optional.of(new User()));

        mockMvc.perform(get("/api/v1/users/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void createUser_新しいデータを作成する() throws Exception {
        User user = new User();
        user.setName("test");
        User created = new User();
        created.setId(UUID.randomUUID());
        when(userRepository.save(any(User.class))).thenReturn(created);

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());
    }
}
