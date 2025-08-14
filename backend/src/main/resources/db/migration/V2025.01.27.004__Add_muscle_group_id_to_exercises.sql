-- Add muscle_group_id column to exercises table
ALTER TABLE public.exercises 
ADD COLUMN muscle_group_id UUID;

-- Add foreign key constraint
ALTER TABLE public.exercises 
ADD CONSTRAINT fk_exercises_muscle_group 
FOREIGN KEY (muscle_group_id) REFERENCES public.muscle_groups(id);