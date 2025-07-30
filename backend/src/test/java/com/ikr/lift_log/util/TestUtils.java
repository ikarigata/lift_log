package com.ikr.lift_log.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.security.JwtTokenProvider;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

public class TestUtils {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    public static String asJsonString(final Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    public static <T> T fromJson(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    public static <T> T fromJson(MvcResult result, Class<T> clazz) {
        try {
            String content = result.getResponse().getContentAsString();
            return objectMapper.readValue(content, clazz);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    public static String createTestJwtToken(JwtTokenProvider jwtTokenProvider, UUID userId) {
        return jwtTokenProvider.generateToken(userId.toString());
    }
    
    public static User createTestUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("password");
        return user;
    }
}