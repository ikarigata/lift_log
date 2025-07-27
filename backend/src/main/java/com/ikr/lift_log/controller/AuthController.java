package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.LoginRequest;
import com.ikr.lift_log.controller.dto.LoginResponse;
import com.ikr.lift_log.domain.model.User;
import com.ikr.lift_log.security.JwtTokenProvider;
import com.ikr.lift_log.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * 認証関連のエンドポイント
 */
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // データベースでユーザー認証を実行
        Optional<User> userOpt = userService.authenticateUser(
                loginRequest.getEmail(),
                loginRequest.getPassword());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String userId = user.getId().toString();
            String token = jwtTokenProvider.generateToken(userId);

            LoginResponse response = new LoginResponse(
                    token,
                    new LoginResponse.User(userId, user.getName(), user.getEmail()));

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(null);
        }
    }
}