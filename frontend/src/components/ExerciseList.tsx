import React from 'react';
import type { Exercise } from '../types';
import TitleBar from './TitleBar';
import { ClockIcon } from '@heroicons/react/24/outline';

interface ExerciseListProps {
  exercises: Exercise[];
  onBack: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onShowHistory: (exercise: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ 
  exercises, 
  onBack, 
  onSelectExercise,
  onShowHistory
}) => {
  const exercisesByMuscleGroup = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.muscleGroup]) {
      acc[exercise.muscleGroup] = [];
    }
    acc[exercise.muscleGroup].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-primary-bg min-h-screen">
      <TitleBar onBack={onBack}>
        <span className="font-dotgothic">種目選択</span>
      </TitleBar>

      <div className="space-y-[15px]">
        {Object.entries(exercisesByMuscleGroup).map(([muscleGroup, groupExercises]) => (
          <div key={muscleGroup} className="space-y-[10px]">
            <h3 className="text-primary-text font-dotgothic text-lg opacity-80 px-[5px]">
              {muscleGroup}
            </h3>
            <div className="space-y-[5px]">
              {groupExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between w-full bg-primary-bg rounded-[10px] p-[10px] border border-primary-border"
                >
                  <button
                    onClick={() => onSelectExercise(exercise)}
                    className="flex-grow text-left text-primary-text font-dotgothic text-base hover:opacity-70 transition-opacity"
                  >
                    {exercise.name}
                  </button>
                  <button
                    onClick={() => onShowHistory(exercise)}
                    className="p-2 text-primary-text hover:opacity-70 transition-opacity"
                  >
                    <ClockIcon className="h-6 w-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;