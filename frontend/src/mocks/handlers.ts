import { http, HttpResponse } from 'msw'
import type { WorkoutDay, WorkoutRecord, Exercise } from '../types'

const workoutDays: WorkoutDay[] = [
  {
    id: '1',
    date: '2024-07-21',
    name: '胸・肩の日',
    isCompleted: true,
    createdAt: '2024-07-21T10:00:00Z',
    updatedAt: '2024-07-21T12:30:00Z'
  },
  {
    id: '2',
    date: '2024-07-19',
    name: '背中・腕の日',
    isCompleted: true,
    createdAt: '2024-07-19T09:00:00Z',
    updatedAt: '2024-07-19T11:15:00Z'
  },
  {
    id: '3',
    date: '2024-07-17',
    name: '脚の日',
    isCompleted: false,
    createdAt: '2024-07-17T08:30:00Z',
    updatedAt: '2024-07-17T08:30:00Z'
  }
];

const exercises: Exercise[] = [
  { id: 'ex1', name: 'ベンチプレス', muscleGroup: '胸' },
  { id: 'ex2', name: 'ショルダープレス', muscleGroup: '肩' },
  { id: 'ex3', name: 'デッドリフト', muscleGroup: '背中' },
  { id: 'ex4', name: 'スクワット', muscleGroup: '脚' },
  { id: 'ex5', name: 'インクラインベンチプレス', muscleGroup: '胸' },
  { id: 'ex6', name: 'ラテラルレイズ', muscleGroup: '肩' },
  { id: 'ex7', name: 'プルアップ', muscleGroup: '背中' },
  { id: 'ex8', name: 'レッグプレス', muscleGroup: '脚' },
  { id: 'ex9', name: 'バーベルカール', muscleGroup: '腕' },
  { id: 'ex10', name: 'トライセップスプレス', muscleGroup: '腕' },
];

const workoutRecords: WorkoutRecord[] = [
  {
    id: '1',
    workoutDayId: '1',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 80, reps: 8, completed: true },
      { setNumber: 2, weight: 80, reps: 6, completed: true },
      { setNumber: 3, weight: 75, reps: 8, completed: true }
    ],
    createdAt: '2024-07-21T10:00:00Z',
    updatedAt: '2024-07-21T10:30:00Z'
  },
  {
    id: '2',
    workoutDayId: '1',
    exerciseId: 'ex2',
    exerciseName: 'ショルダープレス',
    sets: [
      { setNumber: 1, weight: 40, reps: 10, completed: true },
      { setNumber: 2, weight: 40, reps: 8, completed: true },
      { setNumber: 3, weight: 35, reps: 12, completed: true }
    ],
    createdAt: '2024-07-21T10:45:00Z',
    updatedAt: '2024-07-21T11:00:00Z'
  },
  {
    id: '3',
    workoutDayId: '2',
    exerciseId: 'ex3',
    exerciseName: 'デッドリフト',
    sets: [
      { setNumber: 1, weight: 100, reps: 5, completed: true },
      { setNumber: 2, weight: 100, reps: 5, completed: true },
      { setNumber: 3, weight: 95, reps: 6, completed: true }
    ],
    createdAt: '2024-07-19T09:00:00Z',
    updatedAt: '2024-07-19T09:30:00Z'
  },
  // 前回のベンチプレス記録
  {
    id: '4',
    workoutDayId: '4',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 75, reps: 10, completed: true },
      { setNumber: 2, weight: 75, reps: 8, completed: true },
      { setNumber: 3, weight: 70, reps: 10, completed: true }
    ],
    createdAt: '2024-07-15T10:00:00Z',
    updatedAt: '2024-07-15T10:30:00Z'
  },
  // 前々回のベンチプレス記録
  {
    id: '5',
    workoutDayId: '5',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 70, reps: 10, completed: true },
      { setNumber: 2, weight: 70, reps: 8, completed: true },
      { setNumber: 3, weight: 65, reps: 12, completed: true },
      { setNumber: 4, weight: 65, reps: 10, completed: true }
    ],
    createdAt: '2024-07-12T10:00:00Z',
    updatedAt: '2024-07-12T10:30:00Z'
  },
  // ショルダープレスの過去記録
  {
    id: '6',
    workoutDayId: '4',
    exerciseId: 'ex2',
    exerciseName: 'ショルダープレス',
    sets: [
      { setNumber: 1, weight: 35, reps: 12, completed: true },
      { setNumber: 2, weight: 35, reps: 10, completed: true },
      { setNumber: 3, weight: 30, reps: 15, completed: true }
    ],
    createdAt: '2024-07-15T11:00:00Z',
    updatedAt: '2024-07-15T11:15:00Z'
  },
  {
    id: '7',
    workoutDayId: '5',
    exerciseId: 'ex2',
    exerciseName: 'ショルダープレス',
    sets: [
      { setNumber: 1, weight: 30, reps: 15, completed: true },
      { setNumber: 2, weight: 30, reps: 12, completed: true },
      { setNumber: 3, weight: 25, reps: 15, completed: true }
    ],
    createdAt: '2024-07-12T11:00:00Z',
    updatedAt: '2024-07-12T11:15:00Z'
  }
];

export const handlers = [
  http.get('/api/workout-days', () => {
    return HttpResponse.json(workoutDays)
  }),
  http.get('/api/exercises', () => {
    return HttpResponse.json(exercises)
  }),
  http.get('/api/workout-records', () => {
    return HttpResponse.json(workoutRecords)
  }),
]
