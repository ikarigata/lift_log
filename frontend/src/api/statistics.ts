import { authenticatedFetch, BASE_URL } from './config';
import type { ExerciseProgressResponse } from '../types'; // 型は後で定義します

// ユーザーIDを引数で受け取るように変更（または認証コンテキストから取得）
export const getExerciseProgress = async (userId: string, exerciseId: string): Promise<ExerciseProgressResponse> => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/users/${userId}/statistics/progress/${exerciseId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch exercise progress:', error);
    throw error;
  }
};
