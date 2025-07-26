import React from 'react';
import type { WorkoutDay, WorkoutRecord, Exercise } from '../types';

interface WorkoutDayItemProps {
  workoutDay: WorkoutDay;
  workoutRecords: WorkoutRecord[];
  exercises: Exercise[];
  onClick: () => void;
}

const WorkoutDayItem: React.FC<WorkoutDayItemProps> = ({ workoutDay, workoutRecords, exercises, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  };

  // その日のトレーニング記録から部位を取得
  const getMuscleGroups = () => {
    const dayRecords = workoutRecords.filter(record => record.workoutDayId === workoutDay.id);
    const exerciseIds = dayRecords.map(record => record.exerciseId);
    const dayExercises = exercises.filter(exercise => exerciseIds.includes(exercise.id));
    const muscleGroups = [...new Set(dayExercises.map(exercise => exercise.muscleGroup))];
    return muscleGroups;
  };

  const muscleGroups = getMuscleGroups();

  return (
    <div 
      className="flex items-center justify-between w-full bg-surface-secondary rounded-[10px] p-[10px] border-none hover:bg-surface-container transition-colors cursor-pointer"
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
        {muscleGroups.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {muscleGroups.map((muscleGroup) => (
              <span
                key={muscleGroup}
                className="bg-surface-container text-content-secondary text-xs font-dotgothic px-2 py-1 rounded-md"
              >
                {muscleGroup}
              </span>
            ))}
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