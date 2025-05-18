// ユーザー
export interface User {
    id: string;
    name: string;
    createdAt: string;
  }
  
  export interface UserRequest {
    name: string;
  }
  
  // トレーニング種目
  export interface Exercise {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    muscleGroups?: ExerciseMuscleGroup[];
  }
  
  export interface ExerciseRequest {
    name: string;
    description?: string;
    muscleGroups?: ExerciseMuscleGroupRequest[];
  }
  
  // 筋肉グループ
  export interface MuscleGroup {
    id: string;
    name: string;
    createdAt: string;
  }
  
  export interface MuscleGroupRequest {
    name: string;
  }
  
  // トレーニング種目と筋肉グループの関連
  export interface ExerciseMuscleGroup {
    id: string;
    exerciseId: string;
    muscleGroupId: string;
    muscleGroupName?: string;
    isPrimary: boolean;
  }
  
  export interface ExerciseMuscleGroupRequest {
    muscleGroupId: string;
    isPrimary: boolean;
  }
  
  // トレーニング日
  export interface WorkoutDay {
    id: string;
    userId: string;
    date: string;
    title?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface WorkoutDayRequest {
    userId: string;
    date: string;
    title?: string;
    notes?: string;
  }
  
  // トレーニング実績
  export interface WorkoutRecord {
    id: string;
    workoutDayId: string;
    exerciseId: string;
    exerciseName?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    sets?: WorkoutSet[];
  }
  
  export interface WorkoutRecordRequest {
    exerciseId: string;
    notes?: string;
  }
  
  // 詳細なトレーニング実績（種目情報と筋肉グループ情報を含む）
  export interface WorkoutRecordComplete extends WorkoutRecord {
    exercise: Exercise;
    muscleGroups: ExerciseMuscleGroup[];
  }
  
  // トレーニングセット
  export interface WorkoutSet {
    id: string;
    workoutRecordId: string;
    reps: number;
    weight: number;
    volume?: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface WorkoutSetRequest {
    reps: number;
    weight: number;
  }
  
  // 完全なトレーニング日情報（トレーニング実績、セットなどすべての情報を含む）
  export interface CompleteWorkoutDay extends WorkoutDay {
    workoutRecords: WorkoutRecordComplete[];
    user: User;
  }
  
  // APIエラーレスポンス
  export interface ErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
  }
  
  // 統計情報
  export interface VolumeByMuscleGroupItem {
    muscleGroupId: string;
    muscleGroupName: string;
    totalVolume: number;
  }
  
  export interface VolumeByMuscleGroupResponse {
    userId: string;
    volumeByMuscleGroup: VolumeByMuscleGroupItem[];
  }
  
  export interface ExerciseProgressItem {
    date: string;
    maxWeight: number;
    totalVolume: number;
  }
  
  export interface ExerciseProgressResponse {
    userId: string;
    exerciseId: string;
    exerciseName: string;
    progress: ExerciseProgressItem[];
  }