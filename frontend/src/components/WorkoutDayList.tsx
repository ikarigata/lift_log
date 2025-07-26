import React from 'react';
import WorkoutDayItem from './WorkoutDayItem';
import type { WorkoutDay, WorkoutRecord, Exercise } from '../types';

interface WorkoutDayListProps {
  workoutDays: WorkoutDay[];
  workoutRecords: WorkoutRecord[];
  exercises: Exercise[];
  onWorkoutDayClick: (workoutDay: WorkoutDay) => void;
}

const WorkoutDayList: React.FC<WorkoutDayListProps> = ({ workoutDays, workoutRecords, exercises, onWorkoutDayClick }) => {
  if (workoutDays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-primary-text opacity-60 font-dotgothic text-lg mb-2">
          まだトレーニング記録がありません
        </div>
        <div className="text-primary-text opacity-40 font-dotgothic text-sm">
          新しいトレーニングを追加しましょう
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-[10px]">
      {workoutDays.map((workoutDay) => (
        <WorkoutDayItem
          key={workoutDay.id}
          workoutDay={workoutDay}
          workoutRecords={workoutRecords}
          exercises={exercises}
          onClick={() => onWorkoutDayClick(workoutDay)}
        />
      ))}
    </div>
  );
};

export default WorkoutDayList;