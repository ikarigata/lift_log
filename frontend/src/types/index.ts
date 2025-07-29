export interface WorkoutDay {
  id: string;
  date: string; // ISO date format
  name?: string; // Optional name like "胸の日", "背中の日"
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSet {
  setNumber: number;
  weight: number;
  reps: number;
  subReps?: number; // RM計算には含めないがボリューム計算には含める追加レップ数
}

export interface WorkoutRecord {
  id: string;
  workoutDayId: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  isFavorite?: boolean;
}

export interface SetData {
  weight: number;
  reps: number;
}

export interface ProgressData {
  date: string;
  totalVolume: number;
  maxWeight: number;
  sets: SetData[];
}

export interface ExerciseProgressResponse {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  progressData: ProgressData[];
  maxWeight: number;
  totalSets: number;
  totalReps: number;
}