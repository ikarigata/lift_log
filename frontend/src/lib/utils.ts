import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 日付をYYYY-MM-DD形式に変換
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 数値を小数点第2位までのkg表記に変換
export function formatWeight(weight: number): string {
  return `${weight.toFixed(1)}kg`;
}

// レップ数を表記
export function formatReps(reps: number): string {
  return `${reps}回`;
}

// ボリュームを計算（重量 x レップ数）
export function calculateVolume(weight: number, reps: number): number {
  return weight * reps;
}