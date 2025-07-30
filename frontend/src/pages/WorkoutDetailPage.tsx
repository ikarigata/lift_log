import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkoutDayDetail from '../components/WorkoutDayDetail';
import type { WorkoutDay, WorkoutRecord } from '../types';

interface WorkoutDetailPageProps {
  workoutDays: WorkoutDay[];
  workoutRecords: WorkoutRecord[];
}

const WorkoutDetailPage: React.FC<WorkoutDetailPageProps> = ({ 
  workoutDays, 
  workoutRecords
}) => {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const workoutDay = workoutDays.find(day => day.id === workoutId);

  if (!workoutDay) {
    navigate('/');
    return null;
  }

  const dayRecords = workoutRecords.filter(
    record => record.workoutDayId === workoutDay.id
  );

  const handleBack = () => {
    navigate('/');
  };

  const handleAddExercise = () => {
    navigate(`/workout/${workoutId}/exercises`);
  };

  const handleEditExercise = (record: WorkoutRecord) => {
    navigate(`/workout/${workoutId}/exercise/${record.exerciseId}/edit`, {
      state: { record }
    });
  };

  return (
    <WorkoutDayDetail
      workoutDay={workoutDay}
      workoutRecords={dayRecords}
      onBack={handleBack}
      onAddExercise={handleAddExercise}
      onEditExercise={handleEditExercise}
    />
  );
};

export default WorkoutDetailPage;