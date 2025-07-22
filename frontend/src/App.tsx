import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import TitleBar from './components/TitleBar';
import WorkoutDayList from './components/WorkoutDayList';
import AddWorkoutButton from './components/AddWorkoutButton';
import WorkoutDayDetail from './components/WorkoutDayDetail';
import WorkoutCalendar from './components/WorkoutCalendar'; // 追加

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddWorkout = () => {
    // TODO: 新規ワークアウト作成処理
    console.log('Add workout');
  };

  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-primary-bg min-h-screen">
      <TitleBar />
      <WorkoutCalendar />
      <div className="space-y-[10px]">
        <AddWorkoutButton onClick={handleAddWorkout} />
        <WorkoutDayList
          // TODO: APIから取得したデータを渡す
          workoutDays={[]}
          onWorkoutDayClick={(day) => navigate(`/workout-days/${day.id}`)}
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/workout-days/:id" element={<WorkoutDayDetail />} />
        {/* 他のルートもここに追加 */}
      </Routes>
    </Router>
  );
}

export default App