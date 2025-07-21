-- Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);