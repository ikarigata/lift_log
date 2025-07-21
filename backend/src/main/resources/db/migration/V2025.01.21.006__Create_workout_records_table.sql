-- Workout records table
CREATE TABLE workout_records (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    workout_day_id UUID NOT NULL,
    exercise_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);