import type { WorkoutDay } from '../types';

const BASE_URL = '/api';

export const getWorkoutDays = async (): Promise<WorkoutDay[]> => {
  const response = await fetch(`${BASE_URL}/workout-days`);
  if (!response.ok) {
    throw new Error('Failed to fetch workout days');
  }
  return response.json();
};

export const addWorkoutDay = async (workoutDay: Omit<WorkoutDay, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkoutDay> => {
  const response = await fetch(`${BASE_URL}/workout-days`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutDay),
  });
  if (!response.ok) {
    throw new Error('Failed to add workout day');
  }
  return response.json();
};
