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
      className="flex items-center justify-between w-full bg-surface-container rounded-[10px] p-[10px] border-none hover:bg-surface-secondary transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="text-content-secondary font-dotgothic text-lg">
          {formatDate(workoutDay.date)}
        </div>
        {workoutDay.name && (
          <div className="text-content-secondary opacity-80 font-dotgothic text-sm">
            {workoutDay.name}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-[10px]">
        <div className={`w-3 h-3 rounded-full ${workoutDay.isCompleted ? 'bg-green-500' : 'bg-gray-500'}`} />
        <div className="text-content-secondary font-dotgothic text-2xl">
          ›
        </div>
      </div>
    </div>
  );
};

export default WorkoutDayItem;