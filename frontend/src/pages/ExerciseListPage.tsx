import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExerciseList from '../components/ExerciseList';
import type { Exercise } from '../types';

interface ExerciseListPageProps {
  exercises: Exercise[];
  
}

const ExerciseListPage: React.FC<ExerciseListPageProps> = ({ exercises }) => {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/workout/${workoutId}`);
  };

  const handleSelectExercise = (exercise: Exercise) => {
    navigate(`/workout/${workoutId}/exercise/${exercise.id}`);
  };

  return (
    <ExerciseList
      exercises={exercises}
      onBack={handleBack}
      onSelectExercise={handleSelectExercise}
    />
  );
};

export default ExerciseListPage;