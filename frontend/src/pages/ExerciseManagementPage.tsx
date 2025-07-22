import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseManagement from '../components/ExerciseManagement';
import type { Exercise } from '../types';

interface ExerciseManagementPageProps {
  exercises: Exercise[];
  onAddExercise: (name: string, muscleGroup: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
}

const ExerciseManagementPage: React.FC<ExerciseManagementPageProps> = ({ 
  exercises, 
  onAddExercise, 
  onDeleteExercise 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <ExerciseManagement
      exercises={exercises}
      onBack={handleBack}
      onAddExercise={onAddExercise}
      onDeleteExercise={onDeleteExercise}
    />
  );
};

export default ExerciseManagementPage;