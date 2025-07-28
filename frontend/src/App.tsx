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
import { isAuthenticated, removeToken } from './utils/auth';

// レイアウトコンポーネント（ボトムナビゲーション付き）
const Layout = ({ children, onAddWorkout, onLogout }: { children: React.ReactNode, onAddWorkout: () => void, onLogout: () => void }) => {
  const location = useLocation();
  const showBottomNav = location.pathname !== '/login';

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <div 
        className={`flex-1 w-full ${showBottomNav ? 'pb-10' : ''}`}
        style={{ 
          minHeight: showBottomNav ? 'calc(100vh - 5rem)' : '100vh',
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
const PrivateRoute = ({ element, isAuthenticatedState }: { element: React.ReactElement, isAuthenticatedState: boolean }) => {
  return isAuthenticatedState ? element : <Navigate to="/login" />;
};

// ナビゲーション機能を持つコンポーネント
const AppContent = () => {
  const navigate = useNavigate();
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false); // 認証状態を管理

  // 認証チェックのロジック（JWTトークンの有効性を確認）
  useEffect(() => {
    setIsAuthenticatedState(isAuthenticated());
  }, []);


  useEffect(() => {
    if (!isAuthenticatedState) return; // 認証されていない場合はデータをフェッチしない
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
        // 認証エラーの場合はログアウト
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          handleLogout();
        }
      }
    };
    fetchData();
  }, [isAuthenticatedState]);

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

  const handleSaveExercise = async (workoutId: string, exerciseId: string, sets: WorkoutSet[], memo?: string, editingRecordId?: string) => {
    try {
      const savedRecord = await saveWorkoutRecord(workoutId, exerciseId, sets, memo, editingRecordId);
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
    setIsAuthenticatedState(true);
  };

  // ログアウト時に呼び出される関数
  const handleLogout = () => {
    removeToken();
    setIsAuthenticatedState(false);
    setWorkoutDays([]);
    setExercises([]);
    setWorkoutRecords([]);
    navigate('/login');
  };

  return (
    <Layout onAddWorkout={handleAddWorkout} onLogout={handleLogout}>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/"
          element={
            <PrivateRoute
              isAuthenticatedState={isAuthenticatedState}
              element={
                <HomePage
                  workoutDays={workoutDays}
                  workoutRecords={workoutRecords}
                  exercises={exercises}
                  onLogout={handleLogout}
                />
              }
            />
          }
        />
        <Route
          path="/workout/:workoutId"
          element={
            <PrivateRoute
              isAuthenticatedState={isAuthenticatedState}
              element={
                <WorkoutDetailPage
                  workoutDays={workoutDays}
                  workoutRecords={workoutRecords}
                  onLogout={handleLogout}
                />
              }
            />
          }
        />
        <Route
          path="/workout/:workoutId/exercises"
          element={
            <PrivateRoute
              isAuthenticatedState={isAuthenticatedState}
              element={
                <ExerciseListPage
                  exercises={exercises}
                  onLogout={handleLogout}
                />
              }
            />
          }
        />
        <Route
          path="/workout/:workoutId/exercise/:exerciseId"
          element={
            <PrivateRoute
              isAuthenticatedState={isAuthenticatedState}
              element={
                <ExerciseInputPage
                  exercises={exercises}
                  workoutRecords={workoutRecords}
                  onSaveExercise={handleSaveExercise}
                  onLogout={handleLogout}
                />
              }
            />
          }
        />
        <Route
          path="/workout/:workoutId/exercise/:exerciseId/edit"
          element={
            <PrivateRoute
              isAuthenticatedState={isAuthenticatedState}
              element={
                <ExerciseInputPage
                  exercises={exercises}
                  workoutRecords={workoutRecords}
                  onSaveExercise={handleSaveExercise}
                  onLogout={handleLogout}
                />
              }
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute
              isAuthenticatedState={isAuthenticatedState}
              element={<CalendarPage onLogout={handleLogout} />}
            />
          }
        />
        <Route
          path="/exercises"
          element={
            <PrivateRoute
              isAuthenticatedState={isAuthenticatedState}
              element={
                <ExerciseManagementPage
                  exercises={exercises}
                  onAddExercise={handleAddNewExercise}
                  onDeleteExercise={handleDeleteExercise}
                  onToggleFavorite={handleToggleFavorite}
                  onLogout={handleLogout}
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