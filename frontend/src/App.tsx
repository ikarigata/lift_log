import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import ExerciseListPage from './pages/ExerciseListPage';
import ExerciseInputPage from './pages/ExerciseInputPage';
import CalendarPage from './pages/CalendarPage';
import ExerciseManagementPage from './pages/ExerciseManagementPage';
import LoginPage from './pages/LoginPage';
import BottomNavigation from './components/BottomNavigation';
import type { WorkoutDay, WorkoutRecord, Exercise, WorkoutSet } from './types';
import { getWorkoutDays, addWorkoutDay } from './api/workouts';
import { getExercises, addExercise, deleteExercise, getWorkoutRecords, saveWorkoutRecord } from './api/exercises';

// レイアウトコンポーネント（ボトムナビゲーション付き）
const Layout = ({ children, onAddWorkout }: { children: React.ReactNode, onAddWorkout: () => void }) => {
  const location = useLocation();
  const showBottomNav = location.pathname !== '/login';

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <div 
        className={`flex-1 w-full ${showBottomNav ? 'pb-10' : ''}`}
        style={{ 
          minHeight: showBottomNav ? 'calc(100vh - 2.5rem)' : '100vh',
          WebkitOverflowScrolling: 'touch' // iOSでのスムーススクロール
        }}
      >
        {children}
      </div>
      {showBottomNav && <BottomNavigation onAddWorkout={onAddWorkout} />}
    </div>
  );
};

// 認証状態をチェックするコンポーネント
const PrivateRoute = ({ element, isAuthenticated }: { element: React.ReactElement, isAuthenticated: boolean }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

// ナビゲーション機能を持つコンポーネント
const AppContent = () => {
  const navigate = useNavigate();
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 認証状態を管理

  // 認証チェックのロジック（例：トークンをローカルストレージで確認）
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);


  useEffect(() => {
    if (!isAuthenticated) return; // 認証されていない場合はデータをフェッチしない
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
  }, [isAuthenticated]);

  const handleAddWorkout = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // 今日のトレーニング日が既に存在するかチェック
      const existingWorkout = workoutDays.find(workout => workout.date === today);
      
      if (existingWorkout) {
        // 既存のトレーニング日がある場合はそのページに遷移
        navigate(`/workout/${existingWorkout.id}`);
      } else {
        // 新しいトレーニング日を作成してからページに遷移
        const newWorkoutData = {
          date: today,
          name: '',
          isCompleted: false,
        };
        const newWorkout = await addWorkoutDay(newWorkoutData);
        setWorkoutDays([newWorkout, ...workoutDays]);
        navigate(`/workout/${newWorkout.id}`);
      }
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

  const handleToggleFavorite = (exerciseId: string) => {
    setExercises(prev => 
      prev.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, isFavorite: !exercise.isFavorite }
          : exercise
      )
    );
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

  // ログイン成功時に呼び出される関数
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', 'dummy_token'); // ダミーのトークンを保存
  };

  return (
    <Layout onAddWorkout={handleAddWorkout}>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <HomePage
                  workoutDays={workoutDays}
                  workoutRecords={workoutRecords}
                  exercises={exercises}
                />
              }
            />
          }
        />
        <Route
          path="/workout/:workoutId"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <WorkoutDetailPage
                  workoutDays={workoutDays}
                  workoutRecords={workoutRecords}
                />
              }
            />
          }
        />
        <Route
          path="/workout/:workoutId/exercises"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <ExerciseListPage
                  exercises={exercises}
                />
              }
            />
          }
        />
        <Route
          path="/workout/:workoutId/exercise/:exerciseId"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <ExerciseInputPage
                  exercises={exercises}
                  workoutRecords={workoutRecords}
                  onSaveExercise={handleSaveExercise}
                />
              }
            />
          }
        />
        <Route
          path="/workout/:workoutId/exercise/:exerciseId/edit"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <ExerciseInputPage
                  exercises={exercises}
                  workoutRecords={workoutRecords}
                  onSaveExercise={handleSaveExercise}
                />
              }
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<CalendarPage />}
            />
          }
        />
        <Route
          path="/exercises"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <ExerciseManagementPage
                  exercises={exercises}
                  onAddExercise={handleAddNewExercise}
                  onDeleteExercise={handleDeleteExercise}
                  onToggleFavorite={handleToggleFavorite}
                />
              }
            />
          }
        />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App