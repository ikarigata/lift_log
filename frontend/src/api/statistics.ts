import axios from './config';
import type { ExerciseProgressResponse } from '../types'; // 型は後で定義します

// ユーザーIDを引数で受け取るように変更（または認証コンテキストから取得）
export const getExerciseProgress = async (userId: string, exerciseId: string): Promise<ExerciseProgressResponse> => {
  try {
    const response = await axios.get(`/users/${userId}/statistics/progress/${exerciseId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch exercise progress:', error);
    throw error;
  }
};
