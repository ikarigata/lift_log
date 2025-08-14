-- Add email and password fields to users table
ALTER TABLE public.users 
ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL,
ADD COLUMN password_hash VARCHAR(255) NOT NULL;