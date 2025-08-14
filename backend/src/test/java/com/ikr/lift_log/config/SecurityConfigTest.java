package com.ikr.lift_log.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.controller.UserController;
import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.security.JwtAuthenticationFilter;
import com.ikr.lift_log.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
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
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void unauthenticatedUserCanCreateUser() throws Exception {
        doAnswer(invocation -> {
            HttpServletRequest request = invocation.getArgument(0);
            HttpServletResponse response = invocation.getArgument(1);
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(request, response);
            return null;
        }).when(jwtAuthenticationFilter).doFilterInternal(any(HttpServletRequest.class), any(HttpServletResponse.class), any(FilterChain.class));

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

