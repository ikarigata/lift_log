-- Add email and password fields to users table
ALTER TABLE users 
ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL DEFAULT '',
ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';

-- Remove default values after adding columns
ALTER TABLE users 
ALTER COLUMN email DROP DEFAULT,
ALTER COLUMN password_hash DROP DEFAULT;