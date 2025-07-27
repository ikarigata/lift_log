-- Workout sets table
CREATE TABLE workout_sets (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    workout_record_id UUID NOT NULL,
    reps INTEGER NOT NULL,
    sub_reps integer DEFAULT 0,
    weight NUMERIC(10, 2) NOT NULL,
    volume numeric(10, 2) GENERATED ALWAYS AS ((reps + sub_reps) * weight) STORED,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);