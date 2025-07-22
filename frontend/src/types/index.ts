// APIレスポンスに基づいた型定義
export interface WorkoutDayResponse {
  id: string;
  userId: string;
  date: string; // "2025-05-13"
  title: string;
  notes: string;
  createdAt: string; // "2025-05-13T15:30:00Z"
  updatedAt: string;
}

export interface WorkoutRecordResponse {
  id: string;
  workoutDayId: string;
  exerciseId: string;
  exerciseName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSetResponse {
  id: string;
  workoutRecordId: string;
  reps: number;
  weight: number;
  volume: number;
  createdAt: string;
  updatedAt: string;
}

// 既存のUIコンポーネントが使っている可能性のある型も残しておく
export interface WorkoutDay extends WorkoutDayResponse {
  name?: string; // titleのエイリアス
  isCompleted: boolean; // これはUI側で管理する必要があるかもしれない
}

export interface WorkoutSet {
  setNumber: number;
  weight: number;
  reps: number;
  completed?: boolean;
}

export interface WorkoutRecord extends WorkoutRecordResponse {
  sets: WorkoutSet[];
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
}