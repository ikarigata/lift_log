import React from 'react';
import { useNavigate } from 'react-router-dom';
import TitleBar from '../components/TitleBar';
import WorkoutDayList from '../components/WorkoutDayList';
import type { WorkoutDay } from '../types';

interface HomePageProps {
  workoutDays: WorkoutDay[];
  onAddWorkout: () => void; // This prop is kept for the center button logic in App.tsx
}

const HomePage: React.FC<HomePageProps> = ({ workoutDays }) => {
  const navigate = useNavigate();

  const handleWorkoutDayClick = (workoutDay: WorkoutDay) => {
    navigate(`/workout/${workoutDay.id}`);
  };

  return (
    <div className="px-2 py-4 space-y-[10px] bg-primary-bg min-h-screen">
      <TitleBar />
      
      <div className="space-y-[10px]">
        <WorkoutDayList 
          workoutDays={workoutDays}
          onWorkoutDayClick={handleWorkoutDayClick}
        />
      </div>
    </div>
  );
};

export default HomePage;