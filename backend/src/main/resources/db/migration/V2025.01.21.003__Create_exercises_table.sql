-- Exercises table
CREATE TABLE public.exercises (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);