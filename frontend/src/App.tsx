import React, { useState } from 'react'
import TitleBar from './components/TitleBar'
import WorkoutDayList from './components/WorkoutDayList'
import AddWorkoutButton from './components/AddWorkoutButton'
import WorkoutDayDetail from './components/WorkoutDayDetail'
import ExerciseList from './components/ExerciseList'
import ExerciseInput from './components/ExerciseInput'
import ExerciseHistory from './components/ExerciseHistory'
import type { WorkoutDay, WorkoutRecord, Exercise, WorkoutSet } from './types'

type AppView = 'list' | 'detail' | 'exerciseList' | 'exerciseInput' | 'exerciseHistory';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [selectedWorkoutDay, setSelectedWorkoutDay] = useState<WorkoutDay | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [editingRecord, setEditingRecord] = useState<WorkoutRecord | null>(null);
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

  const handleWorkoutDayClick = (workoutDay: WorkoutDay) => {
    setSelectedWorkoutDay(workoutDay);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedWorkoutDay(null);
    setCurrentView('list');
  };

  const handleAddExercise = () => {
    setCurrentView('exerciseList');
  };

  const handleBackToDetail = () => {
    setCurrentView('detail');
  };

  const handleBackToExerciseList = () => {
    setCurrentView('exerciseList');
  }

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setEditingRecord(null);
    setCurrentView('exerciseInput');
  };

  const handleShowExerciseHistory = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentView('exerciseHistory');
  };

  const handleEditExercise = (record: WorkoutRecord) => {
    const exercise = exercises.find(ex => ex.id === record.exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setEditingRecord(record);
      setCurrentView('exerciseInput');
    }
  };

  const handleSaveExercise = (sets: WorkoutSet[]) => {
    if (!selectedWorkoutDay || !selectedExercise) return;

    if (editingRecord) {
      // 既存記録の更新
      const updatedRecord: WorkoutRecord = {
        ...editingRecord,
        sets,
        updatedAt: new Date().toISOString()
      };
      setWorkoutRecords(prev => 
        prev.map(record => record.id === editingRecord.id ? updatedRecord : record)
      );
    } else {
      // 新規記録の追加
      const newRecord: WorkoutRecord = {
        id: Date.now().toString(),
        workoutDayId: selectedWorkoutDay.id,
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
        sets,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setWorkoutRecords(prev => [...prev, newRecord]);
    }

    setSelectedExercise(null);
    setEditingRecord(null);
    setCurrentView('detail');
  };

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
    console.log('Added new workout:', newWorkout);
    // TODO: Navigate to new workout page
  };

  if (currentView === 'detail' && selectedWorkoutDay) {
    const dayRecords = workoutRecords.filter(
      record => record.workoutDayId === selectedWorkoutDay.id
    );
    
    return (
      <WorkoutDayDetail
        workoutDay={selectedWorkoutDay}
        workoutRecords={dayRecords}
        onBack={handleBackToList}
        onAddExercise={handleAddExercise}
        onEditExercise={handleEditExercise}
      />
    );
  }

  if (currentView === 'exerciseList') {
    return (
      <ExerciseList
        exercises={exercises}
        onBack={handleBackToDetail}
        onSelectExercise={handleSelectExercise}
        onShowHistory={handleShowExerciseHistory}
      />
    );
  }

  if (currentView === 'exerciseInput' && selectedExercise) {
    const previousRecords = workoutRecords
      .filter(record => record.exerciseId === selectedExercise.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
      <ExerciseInput
        exercise={selectedExercise}
        previousRecords={previousRecords}
        currentRecord={editingRecord}
        onBack={handleBackToDetail}
        onSave={handleSaveExercise}
      />
    );
  }

  if (currentView === 'exerciseHistory' && selectedExercise) {
    const historyRecords = workoutRecords
      .filter(record => record.exerciseId === selectedExercise.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20)
      .map(record => ({
        ...record,
        workoutDay: workoutDays.find(day => day.id === record.workoutDayId)
      }));

    return (
      <ExerciseHistory
        exercise={selectedExercise}
        records={historyRecords}
        onBack={handleBackToExerciseList}
      />
    );
  }

  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-primary-bg min-h-screen">
      <TitleBar />
      
      <div className="space-y-[10px]">
        <AddWorkoutButton onClick={handleAddWorkout} />
        <WorkoutDayList 
          workoutDays={workoutDays}
          onWorkoutDayClick={handleWorkoutDayClick}
        />
      </div>
    </div>
  )
}

export default App