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
    <div className="w-full px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <div className="flex items-center justify-between mb-[15px]">
        <button 
          onClick={onBack}
          className="text-content-primary font-dotgothic text-2xl hover:opacity-70 transition-opacity"
        >
          ‹
        </button>
        <div className="text-center">
          <h1 className="text-content-primary font-dotgothic text-xl">
            種目選択
          </h1>
        </div>
        <div className="w-6" />
      </div>

      <div className="space-y-[15px]">
        {Object.entries(exercisesByMuscleGroup).map(([muscleGroup, groupExercises]) => (
          <div key={muscleGroup} className="bg-surface-secondary rounded-[10px] overflow-hidden">
            <div className="bg-surface-secondary px-[10px] py-[8px]">
              <h3 className="text-content-secondary font-dotgothic text-lg">
                {muscleGroup}
              </h3>
            </div>
            <div className="p-[10px] space-y-[5px]">
              {groupExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => onSelectExercise(exercise)}
                  className="flex items-center justify-between w-full bg-surface-container rounded-[8px] p-[10px] hover:bg-surface-primary transition-colors"
                >
                  <span className="text-content-secondary font-dotgothic text-base">
                    {exercise.name}
                  </span>
                  <div className="text-content-accent font-dotgothic text-xl">
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