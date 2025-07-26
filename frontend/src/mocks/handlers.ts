import { http, HttpResponse } from 'msw'
import type { WorkoutDay, WorkoutRecord, Exercise } from '../types'

const workoutDays: WorkoutDay[] = [
  {
    id: '1',
    date: '2025-07-23',
    name: '胸・肩の日',
    isCompleted: true,
    createdAt: '2025-07-23T10:00:00Z',
    updatedAt: '2025-07-23T12:30:00Z'
  },
  {
    id: '2',
    date: '2025-07-19',
    name: '背中・腕の日',
    isCompleted: true,
    createdAt: '2025-07-19T09:00:00Z',
    updatedAt: '2025-07-19T11:15:00Z'
  },
  {
    id: '3',
    date: '2025-07-15',
    name: '脚の日',
    isCompleted: false,
    createdAt: '2025-07-15T08:30:00Z',
    updatedAt: '2025-07-15T08:30:00Z'
  },
  {
    id: '4',
    date: '2025-07-11',
    name: '胸・腕の日',
    isCompleted: true,
    createdAt: '2025-07-11T10:00:00Z',
    updatedAt: '2025-07-11T11:30:00Z'
  },
  {
    id: '5',
    date: '2025-07-07',
    name: '背中・肩の日',
    isCompleted: true,
    createdAt: '2025-07-07T09:00:00Z',
    updatedAt: '2025-07-07T10:45:00Z'
  },
  {
    id: '6',
    date: '2025-07-03',
    name: '脚・腹筋の日',
    isCompleted: true,
    createdAt: '2025-07-03T08:00:00Z',
    updatedAt: '2025-07-03T09:30:00Z'
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
  // 2025年7月23日 - 胸・肩の日
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
    createdAt: '2025-07-23T10:00:00Z',
    updatedAt: '2025-07-23T10:30:00Z'
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
    createdAt: '2025-07-23T10:45:00Z',
    updatedAt: '2025-07-23T11:00:00Z'
  },
  // 2025年7月19日 - 背中・腕の日
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
    createdAt: '2025-07-19T09:00:00Z',
    updatedAt: '2025-07-19T09:30:00Z'
  },
  {
    id: '4',
    workoutDayId: '2',
    exerciseId: 'ex9',
    exerciseName: 'バーベルカール',
    sets: [
      { setNumber: 1, weight: 30, reps: 12, completed: true },
      { setNumber: 2, weight: 30, reps: 10, completed: true },
      { setNumber: 3, weight: 25, reps: 15, completed: true }
    ],
    createdAt: '2025-07-19T09:30:00Z',
    updatedAt: '2025-07-19T10:00:00Z'
  },
  // 2025年7月15日 - 脚の日
  {
    id: '5',
    workoutDayId: '3',
    exerciseId: 'ex4',
    exerciseName: 'スクワット',
    sets: [
      { setNumber: 1, weight: 90, reps: 10, completed: false },
      { setNumber: 2, weight: 85, reps: 12, completed: false },
      { setNumber: 3, weight: 80, reps: 15, completed: false }
    ],
    createdAt: '2025-07-15T08:30:00Z',
    updatedAt: '2025-07-15T08:30:00Z'
  },
  // 2025年7月11日 - 胸・腕の日
  {
    id: '6',
    workoutDayId: '4',
    exerciseId: 'ex1',
    exerciseName: 'ベンチプレス',
    sets: [
      { setNumber: 1, weight: 75, reps: 10, completed: true },
      { setNumber: 2, weight: 75, reps: 8, completed: true },
      { setNumber: 3, weight: 70, reps: 10, completed: true }
    ],
    createdAt: '2025-07-11T10:00:00Z',
    updatedAt: '2025-07-11T10:30:00Z'
  },
  {
    id: '7',
    workoutDayId: '4',
    exerciseId: 'ex10',
    exerciseName: 'トライセップスプレス',
    sets: [
      { setNumber: 1, weight: 25, reps: 12, completed: true },
      { setNumber: 2, weight: 25, reps: 10, completed: true },
      { setNumber: 3, weight: 20, reps: 15, completed: true }
    ],
    createdAt: '2025-07-11T10:45:00Z',
    updatedAt: '2025-07-11T11:00:00Z'
  },
  // 2025年7月7日 - 背中・肩の日
  {
    id: '8',
    workoutDayId: '5',
    exerciseId: 'ex7',
    exerciseName: 'プルアップ',
    sets: [
      { setNumber: 1, weight: 0, reps: 8, completed: true },
      { setNumber: 2, weight: 0, reps: 6, completed: true },
      { setNumber: 3, weight: 0, reps: 5, completed: true }
    ],
    createdAt: '2025-07-07T09:00:00Z',
    updatedAt: '2025-07-07T09:30:00Z'
  },
  {
    id: '9',
    workoutDayId: '5',
    exerciseId: 'ex6',
    exerciseName: 'ラテラルレイズ',
    sets: [
      { setNumber: 1, weight: 10, reps: 15, completed: true },
      { setNumber: 2, weight: 10, reps: 12, completed: true },
      { setNumber: 3, weight: 8, reps: 18, completed: true }
    ],
    createdAt: '2025-07-07T09:30:00Z',
    updatedAt: '2025-07-07T10:00:00Z'
  },
  // 2025年7月3日 - 脚・腹筋の日
  {
    id: '10',
    workoutDayId: '6',
    exerciseId: 'ex8',
    exerciseName: 'レッグプレス',
    sets: [
      { setNumber: 1, weight: 120, reps: 12, completed: true },
      { setNumber: 2, weight: 120, reps: 10, completed: true },
      { setNumber: 3, weight: 100, reps: 15, completed: true }
    ],
    createdAt: '2025-07-03T08:00:00Z',
    updatedAt: '2025-07-03T08:30:00Z'
  }
];

export const handlers = [
  // Workout Days
  http.get('/api/workout-days', () => {
    return HttpResponse.json(workoutDays)
  }),
  http.get('/api/workout-days/calendar', ({ request }) => {
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
  }),
  http.post('/api/workout-days', async ({ request }) => {
    const newWorkoutData = await request.json() as Omit<WorkoutDay, 'id' | 'createdAt' | 'updatedAt'>;
    const newWorkout: WorkoutDay = {
      id: Date.now().toString(),
      ...newWorkoutData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    workoutDays.unshift(newWorkout);
    return HttpResponse.json(newWorkout);
  }),

  // Exercises
  http.get('/api/exercises', () => {
    return HttpResponse.json(exercises)
  }),
  http.post('/api/exercises', async ({ request }) => {
    const newExerciseData = await request.json() as Omit<Exercise, 'id'>;
    const newExercise: Exercise = {
      id: `ex${Date.now()}`,
      ...newExerciseData
    };
    exercises.push(newExercise);
    return HttpResponse.json(newExercise);
  }),
  http.delete('/api/exercises/:exerciseId', ({ params }) => {
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
  }),

  // Workout Records
  http.get('/api/workout-records', () => {
    return HttpResponse.json(workoutRecords)
  }),
  http.post('/api/workout-records', async ({ request }) => {
    const data = await request.json() as { workoutDayId: string; exerciseId: string; sets: any[] };
    const exercise = exercises.find(ex => ex.id === data.exerciseId);
    const newRecord: WorkoutRecord = {
      id: Date.now().toString(),
      workoutDayId: data.workoutDayId,
      exerciseId: data.exerciseId,
      exerciseName: exercise?.name || '',
      sets: data.sets,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    workoutRecords.push(newRecord);
    return HttpResponse.json(newRecord);
  }),
  http.put('/api/workout-records/:recordId', async ({ params, request }) => {
    const { recordId } = params;
    const data = await request.json() as { workoutDayId: string; exerciseId: string; sets: any[] };
    const recordIndex = workoutRecords.findIndex(record => record.id === recordId);
    if (recordIndex !== -1) {
      workoutRecords[recordIndex] = {
        ...workoutRecords[recordIndex],
        sets: data.sets,
        updatedAt: new Date().toISOString()
      };
      return HttpResponse.json(workoutRecords[recordIndex]);
    }
    return new HttpResponse(null, { status: 404 });
  }),
  // Login
  http.post('/api/v1/login', async ({ request }) => {
    try {
      const { email, password } = await request.json() as any;
      if (email === 'test@example.com' && password === 'password') {
        return HttpResponse.json({
          token: 'dummy-auth-token',
          user: { id: 'user-1', name: 'Test User' },
        });
      } else {
        return new HttpResponse(JSON.stringify({ message: 'Unauthorized' }), {
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
