import { authenticatedFetch, BASE_URL } from './config';
import type { ExerciseProgressResponse } from '../types';

export const getExerciseProgress = async (exerciseId: string): Promise<ExerciseProgressResponse> => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/statistics/progress/${exerciseId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch exercise progress:', error);
    throw error;
  }
};
