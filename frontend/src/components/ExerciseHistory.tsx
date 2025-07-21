import React from 'react';
import type { Exercise, WorkoutRecord, WorkoutDay } from '../types';
import TitleBar from './TitleBar';
import SetRecord from './SetRecord';

interface Props {
  exercise: Exercise;
  records: (WorkoutRecord & { workoutDay: WorkoutDay | undefined })[];
  onBack: () => void;
}

const ExerciseHistory: React.FC<Props> = ({ exercise, records, onBack }) => {
  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-primary-bg min-h-screen">
      <TitleBar onBack={onBack}>
        <span className="font-dotgothic">{exercise.name} の履歴</span>
      </TitleBar>

      <div className="space-y-[15px]">
        {records.map(record => (
          <div key={record.id} className="bg-primary-bg rounded-[10px] p-[10px] border border-primary-border">
            <p className="text-primary-text font-dotgothic text-base mb-2">
              {new Date(record.createdAt).toLocaleDateString()}
            </p>
            <div className="space-y-[5px]">
              {record.sets.map(set => (
                <SetRecord
                  key={set.setNumber}
                  setNumber={set.setNumber}
                  weight={set.weight}
                  reps={set.reps}
                  isCompleted={set.completed}
                />
              ))}
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <div className="text-center text-primary-text opacity-70 py-10 font-dotgothic">
            トレーニング履歴がありません。
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseHistory;
