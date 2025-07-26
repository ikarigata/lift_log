export interface WorkoutDay {
  id: string;
  date: string; // ISO date format
  name?: string; // Optional name like "胸の日", "背中の日"
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSet {
  setNumber: number;
  weight: number;
  reps: number;
  completed?: boolean;
}

export interface WorkoutRecord {
  id: string;
  workoutDayId: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  isFavorite?: boolean;
}