import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WorkoutDetailPage from './pages/WorkoutDetailPage'
import ExerciseListPage from './pages/ExerciseListPage'
import ExerciseInputPage from './pages/ExerciseInputPage'
import CalendarPage from './pages/CalendarPage'
import ExerciseManagementPage from './pages/ExerciseManagementPage'
import type { WorkoutDay, WorkoutRecord, Exercise, WorkoutSet } from './types'
import { getWorkoutDays, addWorkoutDay } from './api/workouts'
import { getExercises, addExercise, deleteExercise, getWorkoutRecords, saveWorkoutRecord } from './api/exercises'

function App() {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [days, exs, records] = await Promise.all([
          getWorkoutDays(),
          getExercises(),
          getWorkoutRecords(),
        ]);
        setWorkoutDays(days);
        setExercises(exs);
        setWorkoutRecords(records);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchData();
  }, []);

  const handleAddWorkout = async () => {
    try {
      const newWorkoutData = {
        date: new Date().toISOString().split('T')[0],
        name: '',
        isCompleted: false,
      };
      const newWorkout = await addWorkoutDay(newWorkoutData);
      setWorkoutDays([newWorkout, ...workoutDays]);
    } catch (error) {
      console.error("Failed to add workout", error);
    }
  };

  const handleAddNewExercise = async (name: string, muscleGroup: string) => {
    try {
      const newExerciseData = { name, muscleGroup };
      const newExercise = await addExercise(newExerciseData);
      setExercises(prev => [...prev, newExercise]);
    } catch (error) {
      console.error("Failed to add exercise", error);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      await deleteExercise(exerciseId);
      setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
      setWorkoutRecords(prev => prev.filter(record => record.exerciseId !== exerciseId));
    } catch (error) {
      console.error("Failed to delete exercise", error);
    }
  };

  const handleSaveExercise = async (workoutId: string, exerciseId: string, sets: WorkoutSet[], editingRecordId?: string) => {
    try {
      const savedRecord = await saveWorkoutRecord(workoutId, exerciseId, sets, editingRecordId);
      if (editingRecordId) {
        setWorkoutRecords(prev => 
          prev.map(record => record.id === editingRecordId ? savedRecord : record)
        );
      } else {
        setWorkoutRecords(prev => [...prev, savedRecord]);
      }
    } catch (error) {
      console.error("Failed to save exercise", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
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
    </div>
  )
}

export default App