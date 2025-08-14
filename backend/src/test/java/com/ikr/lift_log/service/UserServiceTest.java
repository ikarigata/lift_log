package com.ikr.lift_log.service;

import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class UserServiceTest {

    private UserService userService;
    
    @Mock
    private UserRepository userRepository;
    
    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository);
        passwordEncoder = new BCryptPasswordEncoder(10);
    }

    @Test
    void createUser_shouldHashPassword() {
        // Arrange
        String plainPassword = "testPassword123";
        User inputUser = new User();
        inputUser.setName("Test User");
        inputUser.setEmail("test@example.com");
        inputUser.setPasswordHash(plainPassword); // 平文パスワード

        User savedUser = new User();
        savedUser.setId(UUID.randomUUID());
        savedUser.setName("Test User");
        savedUser.setEmail("test@example.com");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            savedUser.setPasswordHash(user.getPasswordHash());
            return savedUser;
        });

        // Act
        User result = userService.createUser(inputUser);

        // Assert
        assertNotNull(result.getPasswordHash());
        assertNotEquals(plainPassword, result.getPasswordHash()); // ハッシュ化されている
        assertTrue(passwordEncoder.matches(plainPassword, result.getPasswordHash())); // 平文との照合が成功
        assertTrue(result.getPasswordHash().startsWith("$2a$10$")); // BCryptハッシュの形式
    }

    @Test
    void createUser_withEmptyPassword_shouldNotHash() {
        // Arrange
        User inputUser = new User();
        inputUser.setName("Test User");
        inputUser.setEmail("test@example.com");
        inputUser.setPasswordHash(""); // 空文字

        User savedUser = new User();
        savedUser.setId(UUID.randomUUID());
        savedUser.setName("Test User");
        savedUser.setEmail("test@example.com");
        savedUser.setPasswordHash("");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        User result = userService.createUser(inputUser);

        // Assert
        assertEquals("", result.getPasswordHash());
    }

    @Test
    void createUser_withNullPassword_shouldNotHash() {
        // Arrange
        User inputUser = new User();
        inputUser.setName("Test User");
        inputUser.setEmail("test@example.com");
        inputUser.setPasswordHash(null);

        User savedUser = new User();
        savedUser.setId(UUID.randomUUID());
        savedUser.setName("Test User");
        savedUser.setEmail("test@example.com");
        savedUser.setPasswordHash(null);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        User result = userService.createUser(inputUser);

        // Assert
        assertNull(result.getPasswordHash());
    }
}