import React from 'react';
import TitleBar from './TitleBar';
import type { WorkoutDay, WorkoutRecord } from '../types';

interface WorkoutDayDetailProps {
  workoutDay: WorkoutDay;
  workoutRecords: WorkoutRecord[];
  onBack: () => void;
  onAddExercise: () => void;
  onEditExercise: (record: WorkoutRecord) => void;
  onLogout: () => void;
}

const WorkoutDayDetail: React.FC<WorkoutDayDetailProps> = ({ 
  workoutDay, 
  workoutRecords, 
  onBack: _onBack,
  onAddExercise,
  onEditExercise,
  onLogout
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${year}年${month}月${day}日(${dayOfWeek})`;
  };

  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <TitleBar 
        title={
          <div>
            <div>Workout Detail{workoutDay.name && ` - ${workoutDay.name}`}</div>
            <div className="text-sm opacity-80">{formatDate(workoutDay.date)}</div>
          </div>
        } 
        onLogout={onLogout} 
      />

      <button
        onClick={onAddExercise}
        className="flex items-center justify-center w-full bg-interactive-primary hover:bg-interactive-primary/80 rounded-[10px] p-[10px] transition-colors active:scale-95 transform duration-150"
      >
        <div className="flex items-center space-x-[10px]">
          <div className="text-content-inverse font-dotgothic text-2xl">
            +
          </div>
          <div className="text-content-inverse font-dotgothic text-lg">
            種目を追加
          </div>
        </div>
      </button>

      {workoutRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-content-primary opacity-60 font-dotgothic text-lg mb-2">
            まだトレーニング記録がありません
          </div>
          <div className="text-content-primary opacity-40 font-dotgothic text-sm">
            上のボタンから種目を追加しましょう
          </div>
        </div>
      ) : (
        <div className="space-y-[10px]">
          {workoutRecords.map((record) => (
            <div key={record.id} className="bg-surface-secondary rounded-[10px] p-[10px]">
              <button
                onClick={() => onEditExercise(record)}
                className="w-full hover:bg-surface-container transition-colors text-left rounded-[5px] p-[5px] -m-[5px]"
              >
                <h3 className="text-interactive-primary font-dotgothic text-lg mb-[10px] px-[3px] py-[5px]">
                  {record.exerciseName}
                </h3>
                
                <div className="space-y-[10px]">
                  {record.sets.map((set, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-[5px] px-[3px] border-b border-surface-container last:border-b-0"
                    >
                      <span className="text-content-secondary font-dotgothic text-sm">
                        {set.setNumber}セット目
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-content-secondary font-dotgothic text-sm">
                          {set.weight}kg
                        </span>
                        <span className="text-content-accent font-dotgothic text-sm">
                          ×
                        </span>
                        <span className="text-content-secondary font-dotgothic text-sm">
                          {set.reps}回
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutDayDetail;