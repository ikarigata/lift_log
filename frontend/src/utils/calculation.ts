import { WorkoutSet } from '../types';

/**
 * ワークアウトセットの配列から合計ボリュームを計算する
 * @param sets - ワークアウトセットの配列
 * @returns 合計ボリューム (重量 * 回数 の合計)
 */
export const calculateVolume = (sets: WorkoutSet[]): number => {
  return sets.reduce((total, set) => {
    if (set.weight > 0 && set.reps > 0) {
      return total + set.weight * set.reps;
    }
    return total;
  }, 0);
};

/**
 * ワークアウトセットの配列から最大の推定1RMを計算する (Epley法)
 * @param sets - ワークアウトセットの配列
 * @returns 最大の推定1RM。計算可能なセットがない場合は0を返す。
 */
export const calculate1RM = (sets: WorkoutSet[]): number => {
  const oneRMs = sets.map(set => {
    if (set.weight > 0 && set.reps > 0) {
      // Epley法: 1RM = weight * (1 + reps / 30)
      return set.weight * (1 + set.reps / 30);
    }
    return 0;
  });

  return oneRMs.length > 0 ? Math.max(...oneRMs) : 0;
};
