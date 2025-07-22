import React from 'react';
import type { Exercise } from '../types';

interface ExerciseListProps {
  exercises: Exercise[];
  onBack: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ 
  exercises, 
  onBack, 
  onSelectExercise 
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
      <div className="flex items-center justify-between mb-[15px]">
        <button 
          onClick={onBack}
          className="text-primary-text font-dotgothic text-2xl hover:opacity-70 transition-opacity"
        >
          ‹
        </button>
        <div className="text-center">
          <h1 className="text-primary-text font-dotgothic text-xl">
            種目選択
          </h1>
        </div>
        <div className="w-6" />
      </div>

      <div className="space-y-[15px]">
        {Object.entries(exercisesByMuscleGroup).map(([muscleGroup, groupExercises]) => (
          <div key={muscleGroup} className="space-y-[10px]">
            <h3 className="text-primary-text font-dotgothic text-lg opacity-80 px-[3px]">
              {muscleGroup}
            </h3>
            <div className="space-y-[5px]">
              {groupExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => onSelectExercise(exercise)}
                  className="flex items-center justify-between w-full bg-primary-bg rounded-[10px] p-[10px] border border-primary-border hover:bg-primary-border transition-colors"
                >
                  <span className="text-primary-text font-dotgothic text-base">
                    {exercise.name}
                  </span>
                  <div className="text-primary-text font-dotgothic text-xl">
                    ›
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;