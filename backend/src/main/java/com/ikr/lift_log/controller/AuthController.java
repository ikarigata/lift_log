package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.LoginRequest;
import com.ikr.lift_log.controller.dto.LoginResponse;
import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.security.JwtTokenProvider;
import com.ikr.lift_log.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Optional;

/**
 * 認証関連のエンドポイント
 */
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:4173" })
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthController(JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    /**
     * ログイン
     * 
     * @param loginRequest ログインリクエスト
     * @return ログインレスポンス
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt: email=" + loginRequest.getEmail());
        
        // 開発環境用：test@example.com の場合は認証を緩くする
        if ("test@example.com".equals(loginRequest.getEmail()) && 
            "password".equals(loginRequest.getPassword())) {
            Optional<User> userOpt = userService.getUserByEmail(loginRequest.getEmail());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String userId = user.getId().toString();
                String token = jwtTokenProvider.generateToken(userId);

                System.out.println("Development login successful for user: " + user.getEmail());
                LoginResponse response = new LoginResponse(
                        token,
                        new LoginResponse.User(userId, user.getName(), user.getEmail()));

                return ResponseEntity.ok(response);
            }
        }
        
        // 通常のBCrypt認証
        Optional<User> userOpt = userService.authenticateUser(
                loginRequest.getEmail(),
                loginRequest.getPassword());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String userId = user.getId().toString();
            String token = jwtTokenProvider.generateToken(userId);

            System.out.println("Login successful for user: " + user.getEmail());
            LoginResponse response = new LoginResponse(
                    token,
                    new LoginResponse.User(userId, user.getName(), user.getEmail()));

            return ResponseEntity.ok(response);
        } else {
            System.out.println("Login failed for email: " + loginRequest.getEmail());
            return ResponseEntity.status(401).body(null);
        }
    }
}