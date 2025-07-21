-- Workout sets table
CREATE TABLE workout_sets (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    workout_record_id UUID NOT NULL,
    reps INTEGER NOT NULL,
    weight NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);