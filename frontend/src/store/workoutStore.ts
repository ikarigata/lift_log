import { create } from "zustand";
import { Exercise, MuscleGroup } from "@/types";
import { api } from "@/lib/api";

// 筋トレアプリのメイン状態ストア
interface WorkoutState {
  // データリスト
  exercises: Exercise[];
  muscleGroups: MuscleGroup[];
  
  // ローディング状態
  isLoadingExercises: boolean;
  isLoadingMuscleGroups: boolean;
  
  // エラー状態
  error: string | null;
  
  // アクション
  fetchExercises: () => Promise<void>;
  fetchMuscleGroups: () => Promise<void>;
  clearError: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  // 初期状態
  exercises: [],
  muscleGroups: [],
  isLoadingExercises: false,
  isLoadingMuscleGroups: false,
  error: null,
  
  // アクション
  fetchExercises: async () => {
    try {
      set({ isLoadingExercises: true });
      const exercises = await api.exercises.getAll();
      set({ exercises, isLoadingExercises: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : "トレーニング種目の取得に失敗しました", 
        isLoadingExercises: false 
      });
    }
  },
  
  fetchMuscleGroups: async () => {
    try {
      set({ isLoadingMuscleGroups: true });
      const muscleGroups = await api.muscleGroups.getAll();
      set({ muscleGroups, isLoadingMuscleGroups: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : "筋肉グループの取得に失敗しました", 
        isLoadingMuscleGroups: false 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));