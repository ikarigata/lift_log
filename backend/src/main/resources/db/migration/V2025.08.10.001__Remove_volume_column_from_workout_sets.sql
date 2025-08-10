-- Remove volume column from workout_sets table
ALTER TABLE public.workout_sets DROP COLUMN IF EXISTS volume;