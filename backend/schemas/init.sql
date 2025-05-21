
--------------------------------------------------------------------------------
-- Table : public.exercise_muscle_groups
create table public.exercise_muscle_groups (
  id uuid default gen_random_uuid() not null
  , exercise_id uuid not null
  , muscle_group_id uuid not null
  , is_primary boolean default false
  , primary key (id)
);
/

create unique index exercise_muscle_groups_pkey
  on public.exercise_muscle_groups(id)
/

create unique index exercise_muscle_groups_exercise_id_muscle_group_id_key
  on public.exercise_muscle_groups(exercise_id,muscle_group_id)
/


--------------------------------------------------------------------------------
-- Table : public.exercises
create table public.exercises (
  id uuid default gen_random_uuid() not null
  , name text not null
  , description text
  , created_at timestamp(6) with time zone default now()
  , primary key (id)
);
/

create unique index exercises_pkey
  on public.exercises(id)
/


--------------------------------------------------------------------------------
-- Table : public.muscle_groups
create table public.muscle_groups (
  id uuid default gen_random_uuid() not null
  , name text not null
  , created_at timestamp(6) with time zone default now()
  , primary key (id)
);
/

create unique index muscle_groups_pkey
  on public.muscle_groups(id)
/


--------------------------------------------------------------------------------
-- Table : public.users
create table public.users (
  id uuid default gen_random_uuid() not null
  , name text not null
  , created_at timestamp(6) with time zone default now()
  , primary key (id)
);
/

create unique index users_pkey
  on public.users(id)
/


--------------------------------------------------------------------------------
-- Table : public.workout_days
create table public.workout_days (
  id uuid default gen_random_uuid() not null
  , user_id uuid not null
  , date date default CURRENT_DATE not null
  , title text
  , notes text
  , created_at timestamp(6) with time zone default now()
  , updated_at timestamp(6) with time zone default now()
  , primary key (id)
);
/

create unique index workout_days_pkey
  on public.workout_days(id)
/


--------------------------------------------------------------------------------
-- Table : public.workout_records
create table public.workout_records (
  id uuid default gen_random_uuid() not null
  , workout_day_id uuid not null
  , exercise_id uuid not null
  , notes text
  , created_at timestamp(6) with time zone default now()
  , updated_at timestamp(6) with time zone default now()
  , primary key (id)
);
/

create unique index workout_records_pkey
  on public.workout_records(id)
/


--------------------------------------------------------------------------------
-- Table : public.workout_sets
create table public.workout_sets (
  id uuid default gen_random_uuid() not null
  , workout_record_id uuid not null
  , reps integer not null
  , weight numeric(10, 2) not null
  , volume <Virtual column>
  , created_at timestamp(6) with time zone default now()
  , updated_at timestamp(6) with time zone default now()
  , primary key (id)
);
/

create unique index workout_sets_pkey
  on public.workout_sets(id)
/


--------------------------------------------------------------------------------
-- Foreign Key : exercise_muscle_groups_exercise_id_fkey
alter table public.exercise_muscle_groups
  add constraint exercise_muscle_groups_exercise_id_fkey foreign key (exercise_id) references public.exercises(id);
/


--------------------------------------------------------------------------------
-- Foreign Key : exercise_muscle_groups_muscle_group_id_fkey
alter table public.exercise_muscle_groups
  add constraint exercise_muscle_groups_muscle_group_id_fkey foreign key (muscle_group_id) references public.muscle_groups(id);
/


--------------------------------------------------------------------------------
-- Foreign Key : workout_days_user_id_fkey
alter table public.workout_days
  add constraint workout_days_user_id_fkey foreign key (user_id) references public.users(id);
/


--------------------------------------------------------------------------------
-- Foreign Key : workout_records_exercise_id_fkey
alter table public.workout_records
  add constraint workout_records_exercise_id_fkey foreign key (exercise_id) references public.exercises(id);
/


--------------------------------------------------------------------------------
-- Foreign Key : workout_records_workout_day_id_fkey
alter table public.workout_records
  add constraint workout_records_workout_day_id_fkey foreign key (workout_day_id) references public.workout_days(id);
/


--------------------------------------------------------------------------------
-- Foreign Key : workout_sets_workout_record_id_fkey
alter table public.workout_sets
  add constraint workout_sets_workout_record_id_fkey foreign key (workout_record_id) references public.workout_records(id);
/

