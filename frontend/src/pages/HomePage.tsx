import React from 'react';
import { useNavigate } from 'react-router-dom';
import TitleBar from '../components/TitleBar';
import WorkoutDayList from '../components/WorkoutDayList';
import AddWorkoutButton from '../components/AddWorkoutButton';
import CalendarButton from '../components/CalendarButton';
import ExerciseManagementButton from '../components/ExerciseManagementButton';
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

  const handleShowCalendar = () => {
    navigate('/calendar');
  };

  const handleShowExerciseManagement = () => {
    navigate('/exercises');
  };

  return (
    <div className="px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <TitleBar />
      
      <div className="space-y-[10px]">
        <AddWorkoutButton onClick={onAddWorkout} />
        <CalendarButton onClick={handleShowCalendar} />
        <ExerciseManagementButton onClick={handleShowExerciseManagement} />
        <WorkoutDayList 
          workoutDays={workoutDays}
          onWorkoutDayClick={handleWorkoutDayClick}
        />
      </div>
    </div>
  );
};

export default HomePage;