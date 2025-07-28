import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/Calendar';
import type { WorkoutDay } from '../types';

interface CalendarPageProps {
  onLogout: () => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleSelectDate = (workoutDay: WorkoutDay) => {
    navigate(`/workout/${workoutDay.id}`);
  };

  return (
    <Calendar
      onBack={handleBack}
      onSelectDate={handleSelectDate}
      onLogout={onLogout}
    />
  );
};

export default CalendarPage;