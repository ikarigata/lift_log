-- Workout days table
CREATE TABLE workout_days (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    title TEXT,
    notes TEXT,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);