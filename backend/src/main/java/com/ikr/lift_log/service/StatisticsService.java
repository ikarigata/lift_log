package com.ikr.lift_log.service;

import com.ikr.lift_log.controller.dto.ExerciseProgressResponse;
import com.ikr.lift_log.controller.dto.ExerciseProgressResponse.ProgressData;
import com.ikr.lift_log.controller.dto.ExerciseProgressResponse.ProgressData.SetData;
import com.ikr.lift_log.domain.model.Exercise;
import com.ikr.lift_log.domain.model.MuscleGroup;
import com.ikr.lift_log.domain.model.WorkoutSet;
import com.ikr.lift_log.domain.repository.ExerciseRepository;
import com.ikr.lift_log.domain.repository.MuscleGroupRepository;
import com.ikr.lift_log.domain.repository.WorkoutSetRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final WorkoutSetRepository workoutSetRepository;
    private final ExerciseRepository exerciseRepository;
    private final MuscleGroupRepository muscleGroupRepository;

    public StatisticsService(WorkoutSetRepository workoutSetRepository,
                           ExerciseRepository exerciseRepository,
                           MuscleGroupRepository muscleGroupRepository) {
        this.workoutSetRepository = workoutSetRepository;
        this.exerciseRepository = exerciseRepository;
        this.muscleGroupRepository = muscleGroupRepository;
    }

    public ExerciseProgressResponse getExerciseProgress(UUID userId, UUID exerciseId) {
        // エクササイズ情報を取得
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        // 筋肉グループ情報を取得
        String muscleGroupName = "";
        if (exercise.getMuscleGroupId() != null) {
            muscleGroupName = muscleGroupRepository.findById(exercise.getMuscleGroupId())
                    .map(MuscleGroup::getName)
                    .orElse("");
        }

        // 該当エクササイズのワークアウトセットを取得
        List<WorkoutSet> workoutSets = workoutSetRepository.getWorkoutSetsByExerciseIdAndUserId(exerciseId, userId);
        
        // 日付別にグループ化してプログレスデータを作成
        Map<LocalDate, List<WorkoutSet>> setsByDate = workoutSets.stream()
                .collect(Collectors.groupingBy(set -> set.getCreatedAt().toLocalDate()));

        // 日付順にソートし、直近100回分のデータを取得（横スクロール対応）
        List<ProgressData> allProgressData = setsByDate.entrySet().stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    List<WorkoutSet> setsOnDate = entry.getValue();
                    
                    // その日の最大重量を計算
                    BigDecimal maxWeight = setsOnDate.stream()
                            .map(WorkoutSet::getWeight)
                            .max(BigDecimal::compareTo)
                            .orElse(BigDecimal.ZERO);
                    
                    // その日の総ボリュームを計算（重量 × レップ数の合計）
                    BigDecimal totalVolume = setsOnDate.stream()
                            .map(set -> set.getWeight().multiply(BigDecimal.valueOf(set.getReps())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    // フロントエンドでの1RM計算用にセットデータを作成
                    List<SetData> setDataList = setsOnDate.stream()
                            .map(set -> new SetData(set.getWeight(), set.getReps()))
                            .collect(Collectors.toList());
                    
                    return new ProgressData(date, totalVolume, maxWeight, setDataList);
                })
                .sorted(Comparator.comparing(ProgressData::getDate))
                .collect(Collectors.toList());

        // 直近100回分のデータのみを取得
        List<ProgressData> progressDataList = allProgressData.stream()
                .skip(Math.max(0, allProgressData.size() - 100))
                .collect(Collectors.toList());

        // 統計情報を計算
        BigDecimal overallMaxWeight = workoutSets.stream()
                .map(WorkoutSet::getWeight)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
        
        int totalSets = workoutSets.size();
        int totalReps = workoutSets.stream()
                .mapToInt(WorkoutSet::getReps)
                .sum();

        // レスポンスを構築
        ExerciseProgressResponse response = new ExerciseProgressResponse();
        response.setExerciseId(exerciseId.toString());
        response.setExerciseName(exercise.getName());
        response.setMuscleGroup(muscleGroupName);
        response.setProgressData(progressDataList);
        response.setMaxWeight(overallMaxWeight);
        response.setTotalSets(totalSets);
        response.setTotalReps(totalReps);

        return response;
    }
}