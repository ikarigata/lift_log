package com.ikr.lift_log.controller;

import com.ikr.lift_log.controller.dto.ExerciseProgressResponse;
import com.ikr.lift_log.security.AuthenticationUtil;
import com.ikr.lift_log.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/progress/{exerciseId}")
    public ResponseEntity<ExerciseProgressResponse> getExerciseProgress(@PathVariable UUID exerciseId) {
        // 認証されたユーザーIDを取得
        UUID userId = AuthenticationUtil.requireCurrentUserUUID();
        
        ExerciseProgressResponse progress = statisticsService.getExerciseProgress(userId, exerciseId);
        return ResponseEntity.ok(progress);
    }
}