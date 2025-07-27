CREATE TABLE public.exercise_muscle_groups (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  exercise_id uuid NOT NULL,
  muscle_group_id uuid NOT NULL,
  is_primary boolean DEFAULT false,
  PRIMARY KEY (id)
);

CREATE UNIQUE INDEX exercise_muscle_groups_exercise_id_muscle_group_id_key
  ON public.exercise_muscle_groups(exercise_id, muscle_group_id);

CREATE TABLE public.exercises (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE public.muscle_groups (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  created_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  created_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE public.workout_days (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  title text,
  notes text,
  created_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  updated_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE public.workout_records (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  workout_day_id uuid NOT NULL,
  exercise_id uuid NOT NULL,
  notes text,
  created_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  updated_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE public.workout_sets (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  workout_record_id uuid NOT NULL,
  reps integer NOT NULL,
  sub_reps integer DEFAULT 0,
  weight numeric(10, 2) NOT NULL,
  volume <Virtual column>,
  created_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  updated_at timestamp(6) WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.exercises
  ADD CONSTRAINT exercises_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.exercise_muscle_groups
  ADD CONSTRAINT exercise_muscle_groups_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id);

ALTER TABLE public.exercise_muscle_groups
  ADD CONSTRAINT exercise_muscle_groups_muscle_group_id_fkey FOREIGN KEY (muscle_group_id) REFERENCES public.muscle_groups(id);

ALTER TABLE public.workout_days
  ADD CONSTRAINT workout_days_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.workout_records
  ADD CONSTRAINT workout_records_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id);

ALTER TABLE public.workout_records
  ADD CONSTRAINT workout_records_workout_day_id_fkey FOREIGN KEY (workout_day_id) REFERENCES public.workout_days(id);

ALTER TABLE public.workout_sets
  ADD CONSTRAINT workout_sets_workout_record_id_fkey FOREIGN KEY (workout_record_id) REFERENCES public.workout_records(id);