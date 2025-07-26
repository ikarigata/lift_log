import React from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutDayList from '../components/WorkoutDayList';
import type { WorkoutDay } from '../types';

interface HomePageProps {
  workoutDays: WorkoutDay[];
}

const HomePage: React.FC<HomePageProps> = ({ workoutDays }) => {
  const navigate = useNavigate();

  const handleWorkoutDayClick = (workoutDay: WorkoutDay) => {
    navigate(`/workout/${workoutDay.id}`);
  };

  return (
    <div className="px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <WorkoutDayList 
        workoutDays={workoutDays}
        onWorkoutDayClick={handleWorkoutDayClick}
      />
    </div>
  );
};

export default HomePage;