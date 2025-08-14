package com.ikr.lift_log.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.controller.UserController;
import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.security.JwtTokenProvider;
import com.ikr.lift_log.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void unauthenticatedUserCanCreateUser() throws Exception {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("John");
        user.setEmail("john@example.com");
        user.setPasswordHash("hash");

        when(userService.createUser(any(User.class))).thenReturn(user);

        String json = objectMapper.writeValueAsString(user);

        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());
    }
}

