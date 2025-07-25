-- Muscle groups table
CREATE TABLE muscle_groups (
    id UUID DEFAULT RANDOM_UUID() NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);