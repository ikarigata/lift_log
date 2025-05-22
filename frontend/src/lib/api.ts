import type { Exercise, MuscleGroup } from "@/types";

// API基本設定
const API_BASE_URL = "/api";

// 共通のfetch関数
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/v1${endpoint}`;
  console.log("fetch実行_"+url);
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    // エラーレスポンスをJSON形式で解析
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `${response.status}: ${response.statusText}`
      );
    } catch (e) {
      // JSONとして解析できない場合はHTTPステータスのみでエラーを投げる
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  // 204 No Contentの場合は空のオブジェクトを返す
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// API機能をエクスポート
export const api = {
  // ユーザー関連API
  users: {
    getAll: () => fetchAPI<any[]>("/users"),
    getById: (id: string) => fetchAPI<any>(`/users/${id}`),
    create: (data: any) =>
      fetchAPI<any>("/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/users/${id}`, {
        method: "DELETE",
      }),
  },

  // トレーニング種目関連API
  exercises: {
    getAll: async (): Promise<Exercise[]> => {
      return fetchAPI<Exercise[]>("/exercises");
    },
    getById: (id: string) => fetchAPI<any>(`/exercises/${id}`),
    create: (data: any) =>
      fetchAPI<any>("/exercises", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/exercises/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/exercises/${id}`, {
        method: "DELETE",
      }),
    getMuscleGroups: (exerciseId: string) =>
      fetchAPI<any[]>(`/exercises/${exerciseId}/muscle-groups`),
    addMuscleGroup: (exerciseId: string, data: any) =>
      fetchAPI<any>(`/exercises/${exerciseId}/muscle-groups`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // 筋肉グループ関連API
  muscleGroups: {
    getAll: async (): Promise<MuscleGroup[]> => {
      return fetchAPI<MuscleGroup[]>("/muscle-groups");
    },
    getById: (id: string) => fetchAPI<any>(`/muscle-groups/${id}`),
    create: (data: any) =>
      fetchAPI<any>("/muscle-groups", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/muscle-groups/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/muscle-groups/${id}`, {
        method: "DELETE",
      }),
  },

  // トレーニング日関連API
  workoutDays: {
    getAll: (params?: { userId?: string; fromDate?: string; toDate?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.userId) queryParams.append("userId", params.userId);
      if (params?.fromDate) queryParams.append("fromDate", params.fromDate);
      if (params?.toDate) queryParams.append("toDate", params.toDate);
      
      const queryString = queryParams.toString();
      return fetchAPI<any[]>(`/workout-days${queryString ? `?${queryString}` : ""}`);
    },
    getById: (id: string) => fetchAPI<any>(`/workout-days/${id}`),
    create: (data: any) =>
      fetchAPI<any>("/workout-days", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/workout-days/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/workout-days/${id}`, {
        method: "DELETE",
      }),
    getWithRecords: (id: string) =>
      fetchAPI<any>(`/workout-days/${id}/with-records`),
    getComplete: (id: string) =>
      fetchAPI<any>(`/workout-days/${id}/complete`),
  },

  // トレーニング実績関連API
  workoutRecords: {
    getByWorkoutDayId: (workoutDayId: string) =>
      fetchAPI<any[]>(`/workout-days/${workoutDayId}/workout-records`),
    getById: (id: string) => fetchAPI<any>(`/workout-records/${id}`),
    create: (workoutDayId: string, data: any) =>
      fetchAPI<any>(`/workout-days/${workoutDayId}/workout-records`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/workout-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/workout-records/${id}`, {
        method: "DELETE",
      }),
  },

  // トレーニングセット関連API
  workoutSets: {
    getByWorkoutRecordId: (workoutRecordId: string) =>
      fetchAPI<any[]>(`/workout-records/${workoutRecordId}/workout-sets`),
    getById: (id: string) => fetchAPI<any>(`/workout-sets/${id}`),
    create: (workoutRecordId: string, data: any) =>
      fetchAPI<any>(`/workout-records/${workoutRecordId}/workout-sets`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/workout-sets/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<void>(`/workout-sets/${id}`, {
        method: "DELETE",
      }),
  },

  // 統計情報API
  statistics: {
    getVolumeByMuscleGroup: (userId: string) =>
      fetchAPI<any>(`/users/${userId}/statistics/volume`),
    getExerciseProgress: (userId: string, exerciseId: string) =>
      fetchAPI<any>(`/users/${userId}/statistics/progress/${exerciseId}`),
  },
};