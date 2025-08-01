-- テストデータのクリーンアップスクリプト
-- 外部キー制約を考慮して削除順序を調整

-- WorkoutSets (workout_recordsを参照)
DELETE FROM workout_sets;

-- WorkoutRecords (workout_daysとexercisesを参照)
DELETE FROM workout_records;

-- WorkoutDays (usersを参照)
DELETE FROM workout_days;

-- ExerciseMuscleGroups (exercisesとmuscle_groupsを参照)
DELETE FROM exercise_muscle_groups;

-- Exercises (usersとmuscle_groupsを参照)
DELETE FROM exercises;

-- MuscleGroups
DELETE FROM muscle_groups;

-- Users (最後に削除)
DELETE FROM users;

-- シーケンスのリセット（必要に応じて）
-- PostgreSQLの場合、UUIDを使用しているためシーケンスリセットは不要