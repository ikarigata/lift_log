import React, { useState, useEffect } from 'react';
import type { WorkoutDay } from '../types';
import { getWorkoutDaysByMonth } from '../api/workouts';

interface CalendarProps {
  onBack: () => void;
  onSelectDate: (workoutDay: WorkoutDay) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onBack, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  useEffect(() => {
    const fetchWorkoutDays = async () => {
      try {
        const data = await getWorkoutDaysByMonth(year, month + 1);
        setWorkoutDays(data);
      } catch (error) {
        console.error('Failed to fetch workout days:', error);
      }
    };

    fetchWorkoutDays();
  }, [year, month]);
  
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
        <div key={`empty-${i}`} className="h-12 border border-white opacity-30" />
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
          className={`h-12 border border-white flex flex-col items-center justify-center font-dotgothic text-sm transition-colors ${
            hasWorkout 
              ? 'bg-interactive-primary text-content-inverse hover:bg-interactive-primary/80 cursor-pointer' 
              : 'bg-surface-secondary text-content-secondary cursor-default'
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
    <div className="w-full px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <div className="mb-[15px]">
        <div className="w-full bg-surface-secondary rounded-[10px] px-[15px] py-[10px] text-center mb-[10px]">
          <h1 className="text-surface-primary font-dotgothic text-xl">
            Calendar
          </h1>
        </div>
      </div>

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
            {dayNames.map(day => (
              <div key={day} className="h-8 flex items-center justify-center">
                <span className="text-content-secondary font-dotgothic text-sm opacity-80">
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
        <div className="bg-surface-secondary border border-white rounded-[10px] p-[10px]">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-interactive-primary rounded-[3px]" />
              <span className="text-content-secondary font-dotgothic text-sm">トレーニング実施日</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-content-secondary font-dotgothic text-sm opacity-80">完了</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-content-secondary font-dotgothic text-sm opacity-80">未完了</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;