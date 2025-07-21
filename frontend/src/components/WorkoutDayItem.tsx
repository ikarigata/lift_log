import React from 'react';
import type { WorkoutDay } from '../types';

interface WorkoutDayItemProps {
  workoutDay: WorkoutDay;
  onClick: () => void;
}

const WorkoutDayItem: React.FC<WorkoutDayItemProps> = ({ workoutDay, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  };

  return (
    <div 
      className="flex items-center justify-between w-full bg-primary-bg rounded-[10px] p-[10px] border border-primary-border hover:bg-primary-border transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="text-primary-text font-dotgothic text-lg">
          {formatDate(workoutDay.date)}
        </div>
        {workoutDay.name && (
          <div className="text-primary-text opacity-80 font-dotgothic text-sm">
            {workoutDay.name}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-[10px]">
        <div className={`w-3 h-3 rounded-full ${workoutDay.isCompleted ? 'bg-green-500' : 'bg-gray-500'}`} />
        <div className="text-primary-text font-dotgothic text-2xl">
          ›
        </div>
      </div>
    </div>
  );
};

export default WorkoutDayItem;