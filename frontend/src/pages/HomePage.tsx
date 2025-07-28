import React from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutDayList from '../components/WorkoutDayList';
import type { WorkoutDay, WorkoutRecord, Exercise } from '../types';

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
    <WorkoutDayList 
      workoutDays={workoutDays.slice(0, 10)}
      workoutRecords={workoutRecords}
      exercises={exercises}
      onWorkoutDayClick={handleWorkoutDayClick}
      onLogout={onLogout}
    />
  );
};

export default HomePage;