import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ExerciseInput from '../components/ExerciseInput';
import type { Exercise, WorkoutRecord, WorkoutSet } from '../types';

interface ExerciseInputPageProps {
  exercises: Exercise[];
  workoutRecords: WorkoutRecord[];
  onSaveExercise: (workoutId: string, exerciseId: string, sets: WorkoutSet[], memo?: string, editingRecordId?: string) => void;
}

const ExerciseInputPage: React.FC<ExerciseInputPageProps> = ({ 
  exercises, 
  workoutRecords, 
  onSaveExercise 
}) => {
  const { workoutId, exerciseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const exercise = exercises.find(ex => ex.id === exerciseId);
  const editingRecord = location.state?.record || null;

  if (!exercise || !workoutId) {
    navigate('/');
    return null;
  }

  const previousRecords = workoutRecords
    .filter(record => record.exerciseId === exerciseId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleBack = () => {
    navigate(`/workout/${workoutId}`);
  };

  const handleSave = (sets: WorkoutSet[], memo?: string) => {
    onSaveExercise(workoutId, exerciseId, sets, memo, editingRecord?.id);
    navigate(`/workout/${workoutId}`);
  };

  return (
    <ExerciseInput
      exercise={exercise}
      previousRecords={previousRecords}
      currentRecord={editingRecord}
      onBack={handleBack}
      onSave={handleSave}
    />
  );
};

export default ExerciseInputPage;