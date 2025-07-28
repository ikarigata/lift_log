import { http, HttpResponse } from 'msw'
import type { WorkoutDay, WorkoutRecord, Exercise } from '../types'

// JWT関連の定数とユーティリティ
// const JWT_SECRET = 'mock-secret-key'
const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000' // UUID形式

// 簡易JWT生成（モック用）
const generateMockJWT = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    userId,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24時間後
    iat: Math.floor(Date.now() / 1000)
  }))
  const signature = btoa('mock-signature')
  return `${header}.${payload}.${signature}`
}

// JWTトークンを検証
const verifyAuthToken = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    
    if (payload.exp < now) {
      return null // トークン期限切れ
    }
    
    return payload.userId
  } catch {
    return null
  }
}

// 認証が必要なエンドポイント用のミドルウェア
const requireAuth = (handler: any) => {
  return ({ request, params }: { request: Request; params?: any }) => {
    const userId = verifyAuthToken(request)
    if (!userId) {
      return new HttpResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return handler({ request, params, userId })
  }
}

const workoutDays: WorkoutDay[] = [
  {
    id: '1',
    date: '2025-07-26',
    name: '胸・肩の日',
    createdAt: '2025-07-26T10:00:00Z',
    updatedAt: '2025-07-26T12:30:00Z'
  },
  {
    id: '2',
    date: '2025-07-23',
    name: '背中・腕の日',
    createdAt: '2025-07-23T09:00:00Z',
    updatedAt: '2025-07-23T11:15:00Z'
  },
  {
    id: '3',
    date: '2025-07-20',
    name: '脚の日',
    createdAt: '2025-07-20T08:30:00Z',
    updatedAt: '2025-07-20T08:30:00Z'
  },
  {
    id: '4',
    date: '2025-07-17',
    name: '胸・腕の日',
    createdAt: '2025-07-17T10:00:00Z',
    updatedAt: '2025-07-17T11:30:00Z'
  },
  {
    id: '5',
    date: '2025-07-14',
    name: '背中・肩の日',
    createdAt: '2025-07-14T09:00:00Z',
    updatedAt: '2025-07-14T10:45:00Z'
  },
  {
    id: '6',
    date: '2025-07-11',
    name: '脚・腹筋の日',
    createdAt: '2025-07-11T08:00:00Z',
    updatedAt: '2025-07-11T09:30:00Z'
  },
  {
    id: '7',
    date: '2025-07-08',
    name: '胸・三頭の日',
    createdAt: '2025-07-08T10:00:00Z',
    updatedAt: '2025-07-08T11:30:00Z'
  },
  {
    id: '8',
    date: '2025-07-05',
    name: '背中・二頭の日',
    createdAt: '2025-07-05T09:00:00Z',
    updatedAt: '2025-07-05T10:45:00Z'
  },
  {
    id: '9',
    date: '2025-07-02',
    name: '脚・肩の日',
    createdAt: '2025-07-02T08:00:00Z',
    updatedAt: '2025-07-02T09:30:00Z'
  },
  {
    id: '10',
    date: '2025-06-29',
    name: '胸・腹筋の日',
    createdAt: '2025-06-29T10:00:00Z',
    updatedAt: '2025-06-29T11:30:00Z'
  },
  {
    id: '11',
    date: '2025-06-26',
    name: '背中・腕の日',
    createdAt: '2025-06-26T09:00:00Z',
    updatedAt: '2025-06-26T10:45:00Z'
  },
  {
    id: '12',
    date: '2025-06-23',
    name: '脚・肩の日',
    createdAt: '2025-06-23T08:00:00Z',
    updatedAt: '2025-06-23T09:30:00Z'
  },
  {
    id: '13',
    date: '2025-06-20',
    name: '胸・三頭の日',
    createdAt: '2025-06-20T10:00:00Z',
    updatedAt: '2025-06-20T11:30:00Z'
  },
  {
    id: '14',
    date: '2025-06-17',
    name: '背中・二頭の日',
    createdAt: '2025-06-17T09:00:00Z',
    updatedAt: '2025-06-17T10:45:00Z'
  },
  {
    id: '15',
    date: '2025-06-14',
    name: '脚・腹筋の日',
    createdAt: '2025-06-14T08:00:00Z',
    updatedAt: '2025-06-14T09:30:00Z'
  },
  {
    id: '16',
    date: '2025-06-11',
    name: '胸・肩の日',
    createdAt: '2025-06-11T10:00:00Z',
    updatedAt: '2025-06-11T11:30:00Z'
  },
  {
    id: '17',
    date: '2025-06-08',
    name: '背中・腕の日',
    createdAt: '2025-06-08T09:00:00Z',
    updatedAt: '2025-06-08T10:45:00Z'
  },
  {
    id: '18',
    date: '2025-06-05',
    name: '脚・肩の日',
    createdAt: '2025-06-05T08:00:00Z',
    updatedAt: '2025-06-05T09:30:00Z'
  },
  {
    id: '19',
    date: '2025-06-02',
    name: '胸・三頭の日',
    createdAt: '2025-06-02T10:00:00Z',
    updatedAt: '2025-06-02T11:30:00Z'
  },
  {
    id: '20',
    date: '2025-05-30',
    name: '背中・二頭の日',
    createdAt: '2025-05-30T09:00:00Z',
    updatedAt: '2025-05-30T10:45:00Z'
  },
  {
    id: '21',
    date: '2025-05-27',
    name: '脚・腹筋の日',
    createdAt: '2025-05-27T08:00:00Z',
    updatedAt: '2025-05-27T09:30:00Z'
  },
  {
    id: '22',
    date: '2025-05-24',
    name: '胸・肩の日',
    createdAt: '2025-05-24T10:00:00Z',
    updatedAt: '2025-05-24T11:30:00Z'
  },
  {
    id: '23',
    date: '2025-05-21',
    name: '背中・腕の日',
    createdAt: '2025-05-21T09:00:00Z',
    updatedAt: '2025-05-21T10:45:00Z'
  },
  {
    id: '24',
    date: '2025-05-18',
    name: '脚・肩の日',
    createdAt: '2025-05-18T08:00:00Z',
    updatedAt: '2025-05-18T09:30:00Z'
  },
  {
    id: '25',
    date: '2025-05-15',
    name: '胸・三頭の日',
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-05-15T11:30:00Z'
  }
];

const exercises: Exercise[] = [
  { id: 'ex1', name: 'ベンチプレス', muscleGroup: '胸' },
  { id: 'ex2', name: 'ショルダープレス', muscleGroup: '肩' },
  { id: 'ex3', name: 'デッドリフト', muscleGroup: '背中' },
  { id: 'ex4', name: 'スクワット', muscleGroup: '脚', isFavorite: true },
  { id: 'ex5', name: 'インクラインベンチプレス', muscleGroup: '胸' },
  { id: 'ex6', name: 'ラテラルレイズ', muscleGroup: '肩' },
  { id: 'ex7', name: 'プルアップ', muscleGroup: '背中' },
  { id: 'ex8', name: 'レッグプレス', muscleGroup: '脚' },
  { id: 'ex9', name: 'バーベルカール', muscleGroup: '腕' },
  { id: 'ex10', name: 'トライセップスプレス', muscleGroup: '腕' },
  { id: 'ex11', name: 'ラットプルダウン', muscleGroup: '背中', isFavorite: true },
  { id: 'ex12', name: 'チェストプレス', muscleGroup: '胸', isFavorite: true },
  { id: 'ex13', name: 'プッシュアップ', muscleGroup: '胸', isFavorite: true },
];

const workoutRecords: WorkoutRecord[] = [
  // 2025年7月26日 - 胸・肩の日 (最新)
  {
    id: '1',
    workoutDayId: '1',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 85, reps: 8, subReps: 2 },
      { setNumber: 2, weight: 85, reps: 6, subReps: 1 },
      { setNumber: 3, weight: 80, reps: 8 }
    ],
    memo: '今日は調子が良く、重量を5kg上げることができた！',
    createdAt: '2025-07-26T10:00:00Z',
    updatedAt: '2025-07-26T10:30:00Z'
  },
  {
    id: '2',
    workoutDayId: '1',
    exerciseId: 'ex2',
    exerciseName: 'ショルダープレス',
    sets: [
      { setNumber: 1, weight: 42.5, reps: 10, subReps: 3 },
      { setNumber: 2, weight: 42.5, reps: 8 },
      { setNumber: 3, weight: 40, reps: 12, subReps: 2 }
    ],
    createdAt: '2025-07-26T10:45:00Z',
    updatedAt: '2025-07-26T11:00:00Z'
  },
  // 2025年7月23日 - 背中・腕の日
  {
    id: '3',
    workoutDayId: '2',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 80, reps: 8 },
      { setNumber: 2, weight: 80, reps: 6 },
      { setNumber: 3, weight: 75, reps: 8 }
    ],
    memo: '胸の日だが肩も一緒にやった。少し疲れ気味。',
    createdAt: '2025-07-23T10:00:00Z',
    updatedAt: '2025-07-23T10:30:00Z'
  },
  {
    id: '4',
    workoutDayId: '2',
    exerciseId: 'ex2',
    exerciseName: 'ショルダープレス',
    sets: [
      { setNumber: 1, weight: 40, reps: 10 },
      { setNumber: 2, weight: 40, reps: 8 },
      { setNumber: 3, weight: 35, reps: 12 }
    ],
    createdAt: '2025-07-23T10:45:00Z',
    updatedAt: '2025-07-23T11:00:00Z'
  },
  {
    id: '5',
    workoutDayId: '2',
    exerciseId: 'ex3',
    exerciseName: 'デッドリフト',
    sets: [
      { setNumber: 1, weight: 105, reps: 5, subReps: 1 },
      { setNumber: 2, weight: 105, reps: 5 },
      { setNumber: 3, weight: 100, reps: 6, subReps: 2 }
    ],
    createdAt: '2025-07-23T09:00:00Z',
    updatedAt: '2025-07-23T09:30:00Z'
  },
  {
    id: '6',
    workoutDayId: '2',
    exerciseId: 'ex9',
    exerciseName: 'バーベルカール',
    sets: [
      { setNumber: 1, weight: 32.5, reps: 12 },
      { setNumber: 2, weight: 32.5, reps: 10 },
      { setNumber: 3, weight: 30, reps: 15 }
    ],
    createdAt: '2025-07-23T09:30:00Z',
    updatedAt: '2025-07-23T10:00:00Z'
  },
  // 2025年7月20日 - 脚の日
  {
    id: '7',
    workoutDayId: '3',
    exerciseId: 'ex4',
    exerciseName: 'スクワット',
    sets: [
      { setNumber: 1, weight: 90, reps: 10, subReps: 5 },
      { setNumber: 2, weight: 85, reps: 12 },
      { setNumber: 3, weight: 80, reps: 15, subReps: 3 }
    ],
    createdAt: '2025-07-20T08:30:00Z',
    updatedAt: '2025-07-20T08:30:00Z'
  },
  // 2025年7月17日 - 胸・腕の日  
  {
    id: '8',
    workoutDayId: '4',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 77.5, reps: 8 },
      { setNumber: 2, weight: 77.5, reps: 6 },
      { setNumber: 3, weight: 75, reps: 8 }
    ],
    createdAt: '2025-07-17T10:00:00Z',
    updatedAt: '2025-07-17T10:30:00Z'
  },
  {
    id: '10',
    workoutDayId: '4',
    exerciseId: 'ex10',
    exerciseName: 'トライセップスプレス',
    sets: [
      { setNumber: 1, weight: 27.5, reps: 12 },
      { setNumber: 2, weight: 27.5, reps: 10 },
      { setNumber: 3, weight: 25, reps: 15 }
    ],
    createdAt: '2025-07-17T10:45:00Z',
    updatedAt: '2025-07-17T11:00:00Z'
  },
  // 2025年7月14日 - 背中・肩の日
  {
    id: '11',
    workoutDayId: '5',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 75, reps: 10 },
      { setNumber: 2, weight: 75, reps: 8 },
      { setNumber: 3, weight: 70, reps: 10 }
    ],
    createdAt: '2025-07-14T10:00:00Z',
    updatedAt: '2025-07-14T10:30:00Z'
  },
  {
    id: '12',
    workoutDayId: '5',
    exerciseId: 'ex7',
    exerciseName: 'プルアップ',
    sets: [
      { setNumber: 1, weight: 0, reps: 8 },
      { setNumber: 2, weight: 0, reps: 6 },
      { setNumber: 3, weight: 0, reps: 5 }
    ],
    createdAt: '2025-07-14T09:00:00Z',
    updatedAt: '2025-07-14T09:30:00Z'
  },
  {
    id: '13',
    workoutDayId: '5',
    exerciseId: 'ex6',
    exerciseName: 'ラテラルレイズ',
    sets: [
      { setNumber: 1, weight: 10, reps: 15 },
      { setNumber: 2, weight: 10, reps: 12 },
      { setNumber: 3, weight: 8, reps: 18 }
    ],
    createdAt: '2025-07-14T09:30:00Z',
    updatedAt: '2025-07-14T10:00:00Z'
  },
  // 2025年7月11日 - 脚・腹筋の日
  {
    id: '14',
    workoutDayId: '6',
    exerciseId: 'ex8',
    exerciseName: 'レッグプレス',
    sets: [
      { setNumber: 1, weight: 120, reps: 12 },
      { setNumber: 2, weight: 120, reps: 10 },
      { setNumber: 3, weight: 100, reps: 15 }
    ],
    createdAt: '2025-07-11T08:00:00Z',
    updatedAt: '2025-07-11T08:30:00Z'
  },
  {
    id: '15',
    workoutDayId: '6',
    exerciseId: 'ex4',
    exerciseName: 'スクワット',
    sets: [
      { setNumber: 1, weight: 85, reps: 12, subReps: 3 },
      { setNumber: 2, weight: 80, reps: 15 },
      { setNumber: 3, weight: 75, reps: 18, subReps: 2 }
    ],
    createdAt: '2025-07-11T08:30:00Z',
    updatedAt: '2025-07-11T09:00:00Z'
  },
  // 2025年7月08日 - 胸・三頭の日
  {
    id: '16',
    workoutDayId: '7',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 72.5, reps: 10 },
      { setNumber: 2, weight: 70, reps: 8 },
      { setNumber: 3, weight: 67.5, reps: 12 }
    ],
    createdAt: '2025-07-08T10:00:00Z',
    updatedAt: '2025-07-08T10:30:00Z'
  },
  {
    id: '17',
    workoutDayId: '7',
    exerciseId: 'ex5',
    exerciseName: 'インクラインベンチプレス',
    sets: [
      { setNumber: 1, weight: 55, reps: 10 },
      { setNumber: 2, weight: 52.5, reps: 12 },
      { setNumber: 3, weight: 50, reps: 15 }
    ],
    createdAt: '2025-07-08T10:30:00Z',
    updatedAt: '2025-07-08T11:00:00Z'
  },
  // 2025年7月05日 - 背中・二頭の日
  {
    id: '18',
    workoutDayId: '8',
    exerciseId: 'ex3',
    exerciseName: 'デッドリフト',
    sets: [
      { setNumber: 1, weight: 100, reps: 6 },
      { setNumber: 2, weight: 95, reps: 8 },
      { setNumber: 3, weight: 90, reps: 10 }
    ],
    createdAt: '2025-07-05T09:00:00Z',
    updatedAt: '2025-07-05T09:30:00Z'
  },
  {
    id: '19',
    workoutDayId: '8',
    exerciseId: 'ex11',
    exerciseName: 'ラットプルダウン',
    sets: [
      { setNumber: 1, weight: 65, reps: 12 },
      { setNumber: 2, weight: 60, reps: 15 },
      { setNumber: 3, weight: 55, reps: 18 }
    ],
    createdAt: '2025-07-05T09:30:00Z',
    updatedAt: '2025-07-05T10:00:00Z'
  },
  {
    id: '20',
    workoutDayId: '8',
    exerciseId: 'ex9',
    exerciseName: 'バーベルカール',
    sets: [
      { setNumber: 1, weight: 30, reps: 12 },
      { setNumber: 2, weight: 27.5, reps: 15 },
      { setNumber: 3, weight: 25, reps: 18 }
    ],
    createdAt: '2025-07-05T10:00:00Z',
    updatedAt: '2025-07-05T10:30:00Z'
  },
  // 2025年7月02日 - 脚・肩の日
  {
    id: '21',
    workoutDayId: '9',
    exerciseId: 'ex4',
    exerciseName: 'スクワット',
    sets: [
      { setNumber: 1, weight: 80, reps: 15 },
      { setNumber: 2, weight: 75, reps: 18 },
      { setNumber: 3, weight: 70, reps: 20, subReps: 5 }
    ],
    createdAt: '2025-07-02T08:00:00Z',
    updatedAt: '2025-07-02T08:30:00Z'
  },
  {
    id: '22',
    workoutDayId: '9',
    exerciseId: 'ex2',
    exerciseName: 'ショルダープレス',
    sets: [
      { setNumber: 1, weight: 37.5, reps: 12 },
      { setNumber: 2, weight: 35, reps: 15 },
      { setNumber: 3, weight: 32.5, reps: 18 }
    ],
    createdAt: '2025-07-02T08:30:00Z',
    updatedAt: '2025-07-02T09:00:00Z'
  },
  // 2025年6月29日 - 胸・腹筋の日
  {
    id: '23',
    workoutDayId: '10',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 70, reps: 10 },
      { setNumber: 2, weight: 67.5, reps: 12 },
      { setNumber: 3, weight: 65, reps: 15 }
    ],
    createdAt: '2025-06-29T10:00:00Z',
    updatedAt: '2025-06-29T10:30:00Z'
  },
  // 6月の他の記録も追加...
  {
    id: '24',
    workoutDayId: '11',
    exerciseId: 'ex3',
    exerciseName: 'デッドリフト',
    sets: [
      { setNumber: 1, weight: 95, reps: 6 },
      { setNumber: 2, weight: 90, reps: 8 },
      { setNumber: 3, weight: 85, reps: 10 }
    ],
    createdAt: '2025-06-26T09:00:00Z',
    updatedAt: '2025-06-26T09:30:00Z'
  },
  {
    id: '25',
    workoutDayId: '12',
    exerciseId: 'ex4',
    exerciseName: 'スクワット',
    sets: [
      { setNumber: 1, weight: 75, reps: 15 },
      { setNumber: 2, weight: 70, reps: 18 },
      { setNumber: 3, weight: 65, reps: 20 }
    ],
    createdAt: '2025-06-23T08:00:00Z',
    updatedAt: '2025-06-23T08:30:00Z'
  },
  {
    id: '26',
    workoutDayId: '13',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 67.5, reps: 10 },
      { setNumber: 2, weight: 65, reps: 12 },
      { setNumber: 3, weight: 62.5, reps: 15 }
    ],
    createdAt: '2025-06-20T10:00:00Z',
    updatedAt: '2025-06-20T10:30:00Z'
  },
  {
    id: '27',
    workoutDayId: '14',
    exerciseId: 'ex3',
    exerciseName: 'デッドリフト',
    sets: [
      { setNumber: 1, weight: 90, reps: 6 },
      { setNumber: 2, weight: 85, reps: 8 },
      { setNumber: 3, weight: 80, reps: 10 }
    ],
    createdAt: '2025-06-17T09:00:00Z',
    updatedAt: '2025-06-17T09:30:00Z'
  },
  {
    id: '28',
    workoutDayId: '15',
    exerciseId: 'ex4',
    exerciseName: 'スクワット',
    sets: [
      { setNumber: 1, weight: 70, reps: 15 },
      { setNumber: 2, weight: 67.5, reps: 18 },
      { setNumber: 3, weight: 65, reps: 20 }
    ],
    createdAt: '2025-06-14T08:00:00Z',
    updatedAt: '2025-06-14T08:30:00Z'
  },
  // 5月のデータ
  {
    id: '29',
    workoutDayId: '16',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 65, reps: 10 },
      { setNumber: 2, weight: 62.5, reps: 12 },
      { setNumber: 3, weight: 60, reps: 15 }
    ],
    createdAt: '2025-06-11T10:00:00Z',
    updatedAt: '2025-06-11T10:30:00Z'
  },
  {
    id: '30',
    workoutDayId: '17',
    exerciseId: 'ex3',
    exerciseName: 'デッドリフト',
    sets: [
      { setNumber: 1, weight: 85, reps: 6 },
      { setNumber: 2, weight: 80, reps: 8 },
      { setNumber: 3, weight: 75, reps: 10 }
    ],
    createdAt: '2025-06-08T09:00:00Z',
    updatedAt: '2025-06-08T09:30:00Z'
  },
  {
    id: '31',
    workoutDayId: '18',
    exerciseId: 'ex4',
    exerciseName: 'スクワット',
    sets: [
      { setNumber: 1, weight: 67.5, reps: 15 },
      { setNumber: 2, weight: 65, reps: 18 },
      { setNumber: 3, weight: 62.5, reps: 20 }
    ],
    createdAt: '2025-06-05T08:00:00Z',
    updatedAt: '2025-06-05T08:30:00Z'
  },
  {
    id: '32',
    workoutDayId: '19',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 62.5, reps: 10 },
      { setNumber: 2, weight: 60, reps: 12 },
      { setNumber: 3, weight: 57.5, reps: 15 }
    ],
    createdAt: '2025-06-02T10:00:00Z',
    updatedAt: '2025-06-02T10:30:00Z'
  },
  {
    id: '33',
    workoutDayId: '20',
    exerciseId: 'ex3',
    exerciseName: 'デッドリフト',
    sets: [
      { setNumber: 1, weight: 80, reps: 6 },
      { setNumber: 2, weight: 75, reps: 8 },
      { setNumber: 3, weight: 70, reps: 10 }
    ],
    createdAt: '2025-05-30T09:00:00Z',
    updatedAt: '2025-05-30T09:30:00Z'
  },
  {
    id: '34',
    workoutDayId: '21',
    exerciseId: 'ex4',
    exerciseName: 'スクワット',
    sets: [
      { setNumber: 1, weight: 65, reps: 15 },
      { setNumber: 2, weight: 62.5, reps: 18 },
      { setNumber: 3, weight: 60, reps: 20 }
    ],
    createdAt: '2025-05-27T08:00:00Z',
    updatedAt: '2025-05-27T08:30:00Z'
  },
  {
    id: '35',
    workoutDayId: '22',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 60, reps: 10 },
      { setNumber: 2, weight: 57.5, reps: 12 },
      { setNumber: 3, weight: 55, reps: 15 }
    ],
    createdAt: '2025-05-24T10:00:00Z',
    updatedAt: '2025-05-24T10:30:00Z'
  },
  {
    id: '36',
    workoutDayId: '23',
    exerciseId: 'ex3',
    exerciseName: 'デッドリフト',
    sets: [
      { setNumber: 1, weight: 75, reps: 6 },
      { setNumber: 2, weight: 70, reps: 8 },
      { setNumber: 3, weight: 65, reps: 10 }
    ],
    createdAt: '2025-05-21T09:00:00Z',
    updatedAt: '2025-05-21T09:30:00Z'
  },
  {
    id: '37',
    workoutDayId: '24',
    exerciseId: 'ex4',
    exerciseName: 'スクワット',
    sets: [
      { setNumber: 1, weight: 62.5, reps: 15 },
      { setNumber: 2, weight: 60, reps: 18 },
      { setNumber: 3, weight: 57.5, reps: 20 }
    ],
    createdAt: '2025-05-18T08:00:00Z',
    updatedAt: '2025-05-18T08:30:00Z'
  },
  {
    id: '38',
    workoutDayId: '25',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 57.5, reps: 10 },
      { setNumber: 2, weight: 55, reps: 12 },
      { setNumber: 3, weight: 52.5, reps: 15 }
    ],
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-05-15T10:30:00Z'
  }
];

export const handlers = [
  // Workout Days
  http.get('/api/workout-days', requireAuth(() => {
    return HttpResponse.json(workoutDays)
  })),
  http.get('/api/workout-days/calendar', requireAuth(({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get('year') || '2025');
    const month = parseInt(url.searchParams.get('month') || '1');
    
    const filteredWorkouts = workoutDays.filter(workout => {
      const workoutDate = new Date(workout.date);
      const workoutYear = workoutDate.getFullYear();
      const workoutMonth = workoutDate.getMonth() + 1;
      return workoutYear === year && workoutMonth === month;
    });
    
    return HttpResponse.json(filteredWorkouts);
  })),
  http.post('/api/workout-days', requireAuth(async ({ request }: { request: Request }) => {
    const newWorkoutData = await request.json() as Omit<WorkoutDay, 'id' | 'createdAt' | 'updatedAt'>;
    const newWorkout: WorkoutDay = {
      id: Date.now().toString(),
      ...newWorkoutData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    workoutDays.unshift(newWorkout);
    return HttpResponse.json(newWorkout);
  })),

  // Exercises
  http.get('/api/exercises', requireAuth(() => {
    return HttpResponse.json(exercises)
  })),
  http.post('/api/exercises', requireAuth(async ({ request }: { request: Request }) => {
    const newExerciseData = await request.json() as Omit<Exercise, 'id'>;
    const newExercise: Exercise = {
      id: `ex${Date.now()}`,
      ...newExerciseData
    };
    exercises.push(newExercise);
    return HttpResponse.json(newExercise);
  })),
  http.delete('/api/exercises/:exerciseId', requireAuth(({ params }: { params: any }) => {
    const { exerciseId } = params;
    const index = exercises.findIndex(ex => ex.id === exerciseId);
    if (index !== -1) {
      exercises.splice(index, 1);
      // 関連するworkoutRecordsも削除
      const recordIndexes = [];
      for (let i = workoutRecords.length - 1; i >= 0; i--) {
        if (workoutRecords[i].exerciseId === exerciseId) {
          recordIndexes.push(i);
        }
      }
      recordIndexes.forEach(i => workoutRecords.splice(i, 1));
    }
    return new HttpResponse(null, { status: 204 });
  })),

  // Workout Records
  http.get('/api/workout-records', requireAuth(() => {
    return HttpResponse.json(workoutRecords)
  })),
  http.post('/api/workout-records', requireAuth(async ({ request }: { request: Request }) => {
    const data = await request.json() as { workoutDayId: string; exerciseId: string; sets: any[]; memo?: string };
    const exercise = exercises.find(ex => ex.id === data.exerciseId);
    const newRecord: WorkoutRecord = {
      id: Date.now().toString(),
      workoutDayId: data.workoutDayId,
      exerciseId: data.exerciseId,
      exerciseName: exercise?.name || '',
      sets: data.sets,
      memo: data.memo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    workoutRecords.push(newRecord);
    return HttpResponse.json(newRecord);
  })),
  http.put('/api/workout-records/:recordId', requireAuth(async ({ params, request }: { params: any; request: Request }) => {
    const { recordId } = params;
    const data = await request.json() as { workoutDayId: string; exerciseId: string; sets: any[]; memo?: string };
    const recordIndex = workoutRecords.findIndex(record => record.id === recordId);
    if (recordIndex !== -1) {
      workoutRecords[recordIndex] = {
        ...workoutRecords[recordIndex],
        sets: data.sets,
        memo: data.memo,
        updatedAt: new Date().toISOString()
      };
      return HttpResponse.json(workoutRecords[recordIndex]);
    }
    return new HttpResponse(null, { status: 404 });
  })),
  // Statistics API
  http.get('/api/users/:userId/statistics/progress/:exerciseId', requireAuth(({ params }: { params: any }) => {
    const { exerciseId } = params;
    const exercise = exercises.find(ex => ex.id === exerciseId);
    
    if (!exercise) {
      return new HttpResponse(JSON.stringify({ message: 'Exercise not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 該当する種目のワークアウト記録を取得
    const exerciseRecords = workoutRecords.filter(record => record.exerciseId === exerciseId);
    
    // 日付でグループ化し、統計データを計算
    const progressMap = new Map();
    
    exerciseRecords.forEach(record => {
      const workoutDay = workoutDays.find(day => day.id === record.workoutDayId);
      if (!workoutDay) return;
      
      const date = workoutDay.date;
      
      // 1RM計算 (Epley formula: weight * (1 + reps/30))
      const calculate1RM = (weight: number, reps: number): number => {
        if (reps === 0) return 0;
        return Math.round(weight * (1 + reps / 30) * 100) / 100;
      };
      
      // ボリューム計算 (重量 × セット数 × レップ数)
      let totalVolume = 0;
      let max1RM = 0;
      let maxWeight = 0;
      
      record.sets.forEach(set => {
        // ボリューム計算：メインレップ + サブレップも含める
        const totalReps = set.reps + (set.subReps || 0);
        totalVolume += set.weight * totalReps;
        
        // 最大重量
        maxWeight = Math.max(maxWeight, set.weight);
        
        // 1RM計算：メインレップのみを使用（より正確な1RMのため）
        const oneRM = calculate1RM(set.weight, set.reps);
        max1RM = Math.max(max1RM, oneRM);
      });
      
      if (progressMap.has(date)) {
        const existing = progressMap.get(date);
        progressMap.set(date, {
          date,
          totalVolume: existing.totalVolume + totalVolume,
          maxWeight: Math.max(existing.maxWeight, maxWeight),
          max1RM: Math.max(existing.max1RM, max1RM)
        });
      } else {
        progressMap.set(date, {
          date,
          totalVolume,
          maxWeight,
          max1RM
        });
      }
    });
    
    // 日付順にソート
    const progress = Array.from(progressMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return HttpResponse.json({
      userId: MOCK_USER_ID,
      exerciseId,
      exerciseName: exercise.name,
      progress
    });
  })),

  // Login
  http.post('/api/v1/login', async ({ request }) => {
    try {
      const { email, password } = await request.json() as any;
      if (email === 'test@example.com' && password === 'password') {
        const token = generateMockJWT(MOCK_USER_ID)
        return HttpResponse.json({
          token,
          user: { id: MOCK_USER_ID, name: 'Test User', email },
        });
      } else {
        return new HttpResponse(JSON.stringify({ message: 'Invalid email or password' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (e) {
      return new HttpResponse(JSON.stringify({ message: 'Invalid request body' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }),
]
