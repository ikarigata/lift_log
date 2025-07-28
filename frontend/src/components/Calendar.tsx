import React, { useState, useEffect } from 'react';
import TitleBar from './TitleBar';
import type { WorkoutDay, WorkoutRecord } from '../types';
import { getWorkoutDaysByMonth, getWorkoutRecords } from '../api/workouts';

interface CalendarProps {
  onBack: () => void;
  onSelectDate: (workoutDay: WorkoutDay) => void;
  onLogout: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onBack: _onBack, onSelectDate, onLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutDaysData, workoutRecordsData] = await Promise.all([
          getWorkoutDaysByMonth(year, month + 1),
          getWorkoutRecords()
        ]);
        setWorkoutDays(workoutDaysData);
        setWorkoutRecords(workoutRecordsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [year, month]);
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  const daysInMonth = lastDay.getDate();
  
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const getWorkoutForDate = (date: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return workoutDays.find(workout => workout.date === dateString);
  };

  const getExercisesForDate = (workoutDay: WorkoutDay) => {
    const records = workoutRecords.filter(record => record.workoutDayId === workoutDay.id);
    return records.map(record => record.exerciseName);
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-surface-primary opacity-30" />
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const workout = getWorkoutForDate(day);
      const hasWorkout = !!workout;
      const exercises = hasWorkout ? getExercisesForDate(workout) : [];
      
      days.push(
        <button
          key={day}
          onClick={() => workout && onSelectDate(workout)}
          className={`h-24 border border-surface-primary flex flex-col items-start justify-start p-1 font-dotgothic text-xs transition-colors ${
            hasWorkout 
              ? 'bg-interactive-primary text-content-inverse hover:bg-interactive-primary/80 cursor-pointer' 
              : 'bg-surface-secondary text-content-secondary cursor-default'
          }`}
          disabled={!hasWorkout}
        >
          <span className="font-bold mb-1 text-sm">{day}</span>
          {hasWorkout && (
            <div className="flex flex-col space-y-0.5 w-full">
              {exercises.slice(0, 4).map((exercise, index) => (
                <div key={index} className="text-[10px] leading-tight truncate w-full text-left">
                  {exercise}
                </div>
              ))}
              {exercises.length > 4 && (
                <div className="text-[10px] opacity-70">+{exercises.length - 4}</div>
              )}
            </div>
          )}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <TitleBar title="Calendar" onLogout={onLogout} />

      <div className="space-y-[10px]">
        {/* Month navigation */}
        <div className="flex items-center justify-between bg-surface-secondary border border-white rounded-[10px] p-[10px]">
          <button
            onClick={goToPreviousMonth}
            className="text-content-secondary font-dotgothic text-xl hover:opacity-70 transition-opacity"
          >
            ‹
          </button>
          <h2 className="text-content-secondary font-dotgothic text-lg">
            {year}年{monthNames[month]}
          </h2>
          <button
            onClick={goToNextMonth}
            className="text-content-secondary font-dotgothic text-xl hover:opacity-70 transition-opacity"
          >
            ›
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-surface-secondary border border-white rounded-[10px] p-[10px]">
          {/* Day names header */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map((day, index) => (
              <div key={day} className="h-8 flex items-center justify-center">
                <span className={`font-dotgothic text-sm opacity-80 ${
                  index === 5 || index === 6 ? 'text-orange-500' : 'text-content-secondary'
                }`}>
                  {day}
                </span>
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0">
            {renderCalendarDays()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Calendar;