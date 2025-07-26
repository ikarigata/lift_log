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
      <div className="mb-[15px]">
        <div className="w-full bg-surface-secondary rounded-[10px] px-[15px] py-[10px] text-center mb-[10px]">
          <h1 className="text-surface-primary font-dotgothic text-xl">
            Exercise Selection
          </h1>
        </div>
      </div>

      <div className="space-y-[15px]">
        {Object.entries(exercisesByMuscleGroup).map(([muscleGroup, groupExercises]) => (
          <div key={muscleGroup} className="bg-surface-secondary rounded-[10px] overflow-hidden">
            <div className="bg-surface-secondary px-[10px] py-[8px]">
              <h3 className="text-interactive-primary font-dotgothic text-lg">
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