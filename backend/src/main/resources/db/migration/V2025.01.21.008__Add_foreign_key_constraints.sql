-- Foreign key constraints

-- Exercise muscle groups foreign keys
ALTER TABLE exercise_muscle_groups
    ADD CONSTRAINT exercise_muscle_groups_exercise_id_fkey
    FOREIGN KEY (exercise_id) REFERENCES exercises(id);

ALTER TABLE exercise_muscle_groups
    ADD CONSTRAINT exercise_muscle_groups_muscle_group_id_fkey
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id);

-- Workout days foreign keys
ALTER TABLE workout_days
    ADD CONSTRAINT workout_days_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id);

-- Workout records foreign keys
ALTER TABLE workout_records
    ADD CONSTRAINT workout_records_exercise_id_fkey
    FOREIGN KEY (exercise_id) REFERENCES exercises(id);

ALTER TABLE workout_records
    ADD CONSTRAINT workout_records_workout_day_id_fkey
    FOREIGN KEY (workout_day_id) REFERENCES workout_days(id);

-- Workout sets foreign keys
ALTER TABLE workout_sets
    ADD CONSTRAINT workout_sets_workout_record_id_fkey
    FOREIGN KEY (workout_record_id) REFERENCES workout_records(id);

-- Exercises foreign keys
ALTER TABLE exercises
    ADD CONSTRAINT exercises_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id);
