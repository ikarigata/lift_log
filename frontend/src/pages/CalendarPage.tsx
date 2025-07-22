import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/Calendar';
import type { WorkoutDay } from '../types';

interface CalendarPageProps {
  workoutDays: WorkoutDay[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ workoutDays }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleSelectDate = (workoutDay: WorkoutDay) => {
    navigate(`/workout/${workoutDay.id}`);
  };

  return (
    <Calendar
      workoutDays={workoutDays} 
      onBack={handleBack}
      onSelectDate={handleSelectDate}
    />
  );
};

export default CalendarPage;