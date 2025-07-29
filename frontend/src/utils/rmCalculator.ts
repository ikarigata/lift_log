import type { SetData } from '../types';

/**
 * Epley式を使用して1RMを計算
 * @param weight 重量
 * @param reps レップ数
 * @returns 推定1RM
 */
export const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 0) return 0;
  return Math.round(weight * (1 + reps / 30));
};

/**
 * セットの配列から最大1RMを計算
 * @param sets セットデータの配列
 * @returns 最大1RM
 */
export const calculateMax1RM = (sets: SetData[]): number => {
  if (!sets || sets.length === 0) return 0;
  
  const validSets = sets.filter(set => set.reps > 0 && set.weight > 0);
  if (validSets.length === 0) return 0;
  
  return Math.max(...validSets.map(set => calculate1RM(set.weight, set.reps)));
};

/**
 * 5RMを計算（1RMの87%として算出）
 * @param weight 重量
 * @param reps レップ数
 * @returns 推定5RM
 */
export const calculate5RM = (weight: number, reps: number): number => {
  const oneRM = calculate1RM(weight, reps);
  return Math.round(oneRM * 0.87);
};

/**
 * セットの配列から最大5RMを計算
 * @param sets セットデータの配列
 * @returns 最大5RM
 */
export const calculateMax5RM = (sets: SetData[]): number => {
  if (!sets || sets.length === 0) return 0;
  
  const validSets = sets.filter(set => set.reps > 0 && set.weight > 0);
  if (validSets.length === 0) return 0;
  
  return Math.max(...validSets.map(set => calculate5RM(set.weight, set.reps)));
};