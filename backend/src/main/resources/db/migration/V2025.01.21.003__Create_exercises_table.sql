-- Exercises table
CREATE TABLE exercises (
    id UUID DEFAULT RANDOM_UUID() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);