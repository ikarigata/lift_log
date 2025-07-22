import React from 'react';
import type { WorkoutDay, WorkoutRecord } from '../types';

interface WorkoutDayDetailProps {
  workoutDay: WorkoutDay;
  workoutRecords: WorkoutRecord[];
  onBack: () => void;
  onAddExercise: () => void;
  onEditExercise: (record: WorkoutRecord) => void;
}

const WorkoutDayDetail: React.FC<WorkoutDayDetailProps> = ({ 
  workoutDay, 
  workoutRecords, 
  onBack,
  onAddExercise,
  onEditExercise
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
            {formatDate(workoutDay.date)}
          </h1>
          {workoutDay.name && (
            <p className="text-primary-text opacity-80 font-dotgothic text-sm">
              {workoutDay.name}
            </p>
          )}
        </div>
        <div className={`w-3 h-3 rounded-full ${workoutDay.isCompleted ? 'bg-green-500' : 'bg-gray-500'}`} />
      </div>

      <button
        onClick={onAddExercise}
        className="flex items-center justify-center w-full bg-primary-accent hover:bg-primary-accent/80 rounded-[10px] p-[10px] transition-colors active:scale-95 transform duration-150"
      >
        <div className="flex items-center space-x-[10px]">
          <div className="text-primary-bg font-dotgothic text-2xl">
            +
          </div>
          <div className="text-primary-bg font-dotgothic text-lg">
            種目を追加
          </div>
        </div>
      </button>

      {workoutRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-primary-text opacity-60 font-dotgothic text-lg mb-2">
            まだトレーニング記録がありません
          </div>
          <div className="text-primary-text opacity-40 font-dotgothic text-sm">
            上のボタンから種目を追加しましょう
          </div>
        </div>
      ) : (
        <div className="space-y-[10px]">
          {workoutRecords.map((record) => (
            <button
              key={record.id}
              onClick={() => onEditExercise(record)}
              className="w-full bg-primary-bg border border-primary-border rounded-[10px] p-[3px] hover:bg-primary-border transition-colors text-left"
            >
              <h3 className="text-primary-text font-dotgothic text-lg mb-[10px] px-[3px] py-[5px]">
                {record.exerciseName}
              </h3>
              
              <div className="space-y-[10px]">
                {record.sets.map((set, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-[5px] px-[3px] border-b-2 border-primary-border"
                  >
                    <span className="text-primary-text font-dotgothic text-sm">
                      {set.setNumber}セット目
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-primary-text font-dotgothic text-sm">
                        {set.weight}kg
                      </span>
                      <span className="text-white font-dotgothic text-sm">
                        ×
                      </span>
                      <span className="text-primary-text font-dotgothic text-sm">
                        {set.reps}回
                      </span>
                      <div className={`w-2 h-2 rounded-full ml-2 ${
                        set.completed ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutDayDetail;