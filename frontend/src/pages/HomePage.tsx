import React from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutDayList from '../components/WorkoutDayList';
import type { WorkoutDay, WorkoutRecord, Exercise } from '../types';
import ThemeSwitcher from '../components/ThemeSwitcher';

interface HomePageProps {
  workoutDays: WorkoutDay[];
  workoutRecords: WorkoutRecord[];
  exercises: Exercise[];
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ workoutDays, workoutRecords, exercises, onLogout }) => {
  const navigate = useNavigate();

  const handleWorkoutDayClick = (workoutDay: WorkoutDay) => {
    navigate(`/workout/${workoutDay.id}`);
  };

  return (
    <div className="bg-surface-primary min-h-screen p-4">
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>
      <WorkoutDayList
        workoutDays={workoutDays.slice(0, 10)}
        workoutRecords={workoutRecords}
        exercises={exercises}
        onWorkoutDayClick={handleWorkoutDayClick}
        onLogout={onLogout}
      />
    </div>
  );
};

export default HomePage;