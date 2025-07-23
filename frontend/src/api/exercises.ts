import type { Exercise, WorkoutRecord, WorkoutSet } from '../types';

const BASE_URL = '/api';

export const getExercises = async (): Promise<Exercise[]> => {
  const response = await fetch(`${BASE_URL}/exercises`);
  if (!response.ok) {
    throw new Error('Failed to fetch exercises');
  }
  return response.json();
};

export const addExercise = async (exercise: Omit<Exercise, 'id'>): Promise<Exercise> => {
  const response = await fetch(`${BASE_URL}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exercise),
  });
  if (!response.ok) {
    throw new Error('Failed to add exercise');
  }
  return response.json();
};

export const deleteExercise = async (exerciseId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/exercises/${exerciseId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete exercise');
  }
};


export const getWorkoutRecords = async (): Promise<WorkoutRecord[]> => {
    const response = await fetch(`${BASE_URL}/workout-records`);
    if (!response.ok) {
      throw new Error('Failed to fetch workout records');
    }
    return response.json();
};

export const saveWorkoutRecord = async (workoutId: string, exerciseId: string, sets: WorkoutSet[], editingRecordId?: string): Promise<WorkoutRecord> => {
    const url = editingRecordId
      ? `${BASE_URL}/workout-records/${editingRecordId}`
      : `${BASE_URL}/workout-records`;

    const method = editingRecordId ? 'PUT' : 'POST';

    const body = JSON.stringify({
        workoutDayId: workoutId,
        exerciseId,
        sets,
    });

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    });

    if (!response.ok) {
        throw new Error('Failed to save workout record');
    }
    return response.json();
}
