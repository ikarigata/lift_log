import React, { useState } from 'react';
import type { WorkoutDay } from '../types';

interface CalendarProps {
  workoutDays: WorkoutDay[];
  onBack: () => void;
  onSelectDate: (workoutDay: WorkoutDay) => void;
}

const Calendar: React.FC<CalendarProps> = ({ workoutDays, onBack, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  
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
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-12 border border-primary-border opacity-30" />
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const workout = getWorkoutForDate(day);
      const hasWorkout = !!workout;
      
      days.push(
        <button
          key={day}
          onClick={() => workout && onSelectDate(workout)}
          className={`h-12 border border-primary-border flex flex-col items-center justify-center font-dotgothic text-sm transition-colors ${
            hasWorkout 
              ? 'bg-primary-accent text-primary-bg hover:bg-primary-accent/80 cursor-pointer' 
              : 'bg-primary-bg text-primary-text cursor-default'
          }`}
          disabled={!hasWorkout}
        >
          <span>{day}</span>
          {hasWorkout && (
            <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
              workout.isCompleted ? 'bg-green-400' : 'bg-yellow-400'
            }`} />
          )}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-primary-bg min-h-screen">
      <div className="flex items-center justify-between mb-[15px]">
        <button 
          onClick={onBack}
          className="text-primary-text font-dotgothic text-2xl hover:opacity-70 transition-opacity"
        >
          ‹
        </button>
        <div className="text-center">
          <h1 className="text-primary-text font-dotgothic text-xl">
            トレーニング履歴
          </h1>
        </div>
        <div className="w-6" />
      </div>

      <div className="space-y-[10px]">
        {/* Month navigation */}
        <div className="flex items-center justify-between bg-primary-bg border border-primary-border rounded-[10px] p-[10px]">
          <button
            onClick={goToPreviousMonth}
            className="text-primary-text font-dotgothic text-xl hover:opacity-70 transition-opacity"
          >
            ‹
          </button>
          <h2 className="text-primary-text font-dotgothic text-lg">
            {year}年{monthNames[month]}
          </h2>
          <button
            onClick={goToNextMonth}
            className="text-primary-text font-dotgothic text-xl hover:opacity-70 transition-opacity"
          >
            ›
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-primary-bg border border-primary-border rounded-[10px] p-[10px]">
          {/* Day names header */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map(day => (
              <div key={day} className="h-8 flex items-center justify-center">
                <span className="text-primary-text font-dotgothic text-sm opacity-80">
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

        {/* Legend */}
        <div className="bg-primary-bg border border-primary-border rounded-[10px] p-[10px]">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary-accent rounded-[3px]" />
              <span className="text-primary-text font-dotgothic text-sm">トレーニング実施日</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-primary-text font-dotgothic text-sm opacity-80">完了</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-primary-text font-dotgothic text-sm opacity-80">未完了</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;