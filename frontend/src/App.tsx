import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WorkoutDetailPage from './pages/WorkoutDetailPage'
import ExerciseListPage from './pages/ExerciseListPage'
import ExerciseInputPage from './pages/ExerciseInputPage'
import CalendarPage from './pages/CalendarPage'
import ExerciseManagementPage from './pages/ExerciseManagementPage'
import type { WorkoutDay, WorkoutRecord, Exercise, WorkoutSet } from './types'

function App() {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([
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
  ]);

  const [exercises, setExercises] = useState<Exercise[]>([
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
  ]);

  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([
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
  ]);

  const handleAddWorkout = () => {
    const newWorkout: WorkoutDay = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      name: '',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setWorkoutDays([newWorkout, ...workoutDays]);
  };

  const handleAddNewExercise = (name: string, muscleGroup: string) => {
    const newExercise: Exercise = {
      id: `ex${Date.now()}`,
      name,
      muscleGroup
    };
    setExercises(prev => [...prev, newExercise]);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
    setWorkoutRecords(prev => prev.filter(record => record.exerciseId !== exerciseId));
  };

  const handleSaveExercise = (workoutId: string, exerciseId: string, sets: WorkoutSet[], editingRecordId?: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    if (editingRecordId) {
      // 既存記録の更新
      const editingRecord = workoutRecords.find(record => record.id === editingRecordId);
      if (editingRecord) {
        const updatedRecord: WorkoutRecord = {
          ...editingRecord,
          sets,
          updatedAt: new Date().toISOString()
        };
        setWorkoutRecords(prev => 
          prev.map(record => record.id === editingRecordId ? updatedRecord : record)
        );
      }
    } else {
      // 新規記録の追加
      const newRecord: WorkoutRecord = {
        id: Date.now().toString(),
        workoutDayId: workoutId,
        exerciseId: exerciseId,
        exerciseName: exercise.name,
        sets,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setWorkoutRecords(prev => [...prev, newRecord]);
    }
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              workoutDays={workoutDays} 
              onAddWorkout={handleAddWorkout}
            />
          } 
        />
        <Route 
          path="/workout/:workoutId" 
          element={
            <WorkoutDetailPage 
              workoutDays={workoutDays}
              workoutRecords={workoutRecords}
            />
          } 
        />
        <Route 
          path="/workout/:workoutId/exercises" 
          element={
            <ExerciseListPage 
              exercises={exercises}
            />
          } 
        />
        <Route 
          path="/workout/:workoutId/exercise/:exerciseId" 
          element={
            <ExerciseInputPage 
              exercises={exercises}
              workoutRecords={workoutRecords}
              onSaveExercise={handleSaveExercise}
            />
          } 
        />
        <Route 
          path="/workout/:workoutId/exercise/:exerciseId/edit" 
          element={
            <ExerciseInputPage 
              exercises={exercises}
              workoutRecords={workoutRecords}
              onSaveExercise={handleSaveExercise}
            />
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <CalendarPage 
              workoutDays={workoutDays}
            />
          } 
        />
        <Route 
          path="/exercises" 
          element={
            <ExerciseManagementPage 
              exercises={exercises}
              onAddExercise={handleAddNewExercise}
              onDeleteExercise={handleDeleteExercise}
            />
          } 
        />
      </Routes>
    </Router>
  )
}

export default App