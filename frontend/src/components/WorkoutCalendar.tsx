import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { WorkoutDayResponse } from '../types';

const WorkoutCalendar: React.FC = () => {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDayResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 仮のユーザーID。本来は認証情報から取得します。
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    fetch(`/api/v1/users/${userId}/workout-days`)
      .then(res => res.json())
      .then(data => setWorkoutDays(data));
  }, []);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const isWorkoutDay = workoutDays.some(
        (day) => new Date(day.date).toDateString() === date.toDateString()
      );
      if (isWorkoutDay) {
        return <p className="text-xs text-blue-500">●</p>;
      }
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    const workoutDay = workoutDays.find(
      (day) => new Date(day.date).toDateString() === date.toDateString()
    );
    if (workoutDay) {
      navigate(`/workout-days/${workoutDay.id}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">トレーニングカレンダー</h2>
      <Calendar
        onClickDay={handleDateClick}
        tileContent={tileContent}
        className="w-full"
      />
    </div>
  );
};

export default WorkoutCalendar;
