-- Add muscle_group_id column to exercises table
ALTER TABLE exercises 
ADD COLUMN muscle_group_id UUID;

-- Add foreign key constraint
ALTER TABLE exercises 
ADD CONSTRAINT fk_exercises_muscle_group 
FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id);