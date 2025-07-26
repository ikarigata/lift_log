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
    <div className="px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <div className="w-full bg-surface-secondary rounded-[10px] px-[15px] py-[10px] text-center mb-[15px]">
        <h1 className="text-surface-primary font-dotgothic text-xl">
          History
        </h1>
      </div>
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