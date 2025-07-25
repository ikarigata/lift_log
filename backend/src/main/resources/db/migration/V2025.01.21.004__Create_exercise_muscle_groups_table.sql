-- Exercise muscle groups junction table
CREATE TABLE exercise_muscle_groups (
    id UUID DEFAULT RANDOM_UUID() NOT NULL,
    exercise_id UUID NOT NULL,
    muscle_group_id UUID NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    UNIQUE (exercise_id, muscle_group_id)
);