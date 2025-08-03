import type { MuscleGroup } from '../types';
import { BASE_URL, authenticatedFetch } from './config';

export const getMuscleGroups = async (): Promise<MuscleGroup[]> => {
  const response = await authenticatedFetch(`${BASE_URL}/muscle-groups`);
  if (!response.ok) {
    throw new Error('Failed to fetch muscle groups');
  }
  return response.json();
};
