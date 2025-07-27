import React from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutDayList from '../components/WorkoutDayList';
import type { WorkoutDay, WorkoutRecord, Exercise } from '../types';

interface HomePageProps {
  workoutDays: WorkoutDay[];
  workoutRecords: WorkoutRecord[];
  exercises: Exercise[];
}

const HomePage: React.FC<HomePageProps> = ({ workoutDays, workoutRecords, exercises }) => {
  const navigate = useNavigate();

  const handleWorkoutDayClick = (workoutDay: WorkoutDay) => {
    navigate(`/workout/${workoutDay.id}`);
  };

  return (
    <div className="space-y-[10px] bg-surface-primary min-h-screen">
      <WorkoutDayList 
        workoutDays={workoutDays.slice(0, 10)}
        workoutRecords={workoutRecords}
        exercises={exercises}
        onWorkoutDayClick={handleWorkoutDayClick}
      />
    </div>
  );
};

export default HomePage;