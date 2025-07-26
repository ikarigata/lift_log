import React from 'react';
import { useNavigate } from 'react-router-dom';
import TitleBar from '../components/TitleBar';
import WorkoutDayList from '../components/WorkoutDayList';
import AddWorkoutButton from '../components/AddWorkoutButton';
import type { WorkoutDay } from '../types';

interface HomePageProps {
  workoutDays: WorkoutDay[];
  onAddWorkout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ workoutDays, onAddWorkout }) => {
  const navigate = useNavigate();

  const handleWorkoutDayClick = (workoutDay: WorkoutDay) => {
    navigate(`/workout/${workoutDay.id}`);
  };

  return (
    <div className="px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <TitleBar />
      
      <div className="space-y-[10px]">
        <AddWorkoutButton onClick={onAddWorkout} />
        <WorkoutDayList 
          workoutDays={workoutDays}
          onWorkoutDayClick={handleWorkoutDayClick}
        />
      </div>
    </div>
  );
};

export default HomePage;