import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExerciseList from '../components/ExerciseList';
import type { Exercise, WorkoutRecord } from '../types';

interface ExerciseListPageProps {
  exercises: Exercise[];
  workoutRecords: WorkoutRecord[];
}

const ExerciseListPage: React.FC<ExerciseListPageProps> = ({ exercises, workoutRecords }) => {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/workout/${workoutId}`);
  };

  const handleSelectExercise = (exercise: Exercise) => {
    navigate(`/workout/${workoutId}/exercise/${exercise.id}`);
  };

  // 現在のワークアウトに含まれる運動記録のexerciseIdのリストを取得
  const recordedExerciseIds = workoutRecords
    .filter(record => record.workoutDayId === workoutId)
    .map(record => record.exerciseId);

  // 記録済みの運動を除外したリストを作成
  const availableExercises = exercises.filter(
    exercise => !recordedExerciseIds.includes(exercise.id)
  );

  return (
    <ExerciseList
      exercises={availableExercises}
      onBack={handleBack}
      onSelectExercise={handleSelectExercise}
    />
  );
};

export default ExerciseListPage;