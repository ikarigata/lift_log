import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { WorkoutDayResponse, WorkoutRecordResponse } from '../types';

const WorkoutDayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workoutDay, setWorkoutDay] = useState<WorkoutDayResponse | null>(null);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecordResponse[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/v1/workout-days/${id}`)
        .then(res => res.json())
        .then(data => setWorkoutDay(data));

      fetch(`/api/v1/workout-days/${id}/workout-records`)
        .then(res => res.json())
        .then(data => setWorkoutRecords(data));
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${year}年${month}月${day}日(${dayOfWeek})`;
  };

  if (!workoutDay) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-primary-bg min-h-screen">
      <div className="flex items-center justify-between mb-[15px]">
        <button
          onClick={() => navigate('/')}
          className="text-primary-text font-dotgothic text-2xl hover:opacity-70 transition-opacity"
        >
          ‹
        </button>
        <div className="text-center">
          <h1 className="text-primary-text font-dotgothic text-xl">
            {formatDate(workoutDay.date)}
          </h1>
          {workoutDay.title && (
            <p className="text-primary-text opacity-80 font-dotgothic text-sm">
              {workoutDay.title}
            </p>
          )}
        </div>
        {/* isCompletedはレスポンスにないので一旦削除 */}
        <div className="w-3 h-3" />
      </div>

      <button
        onClick={() => {
          /* TODO: 種目追加画面への遷移 */
        }}
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
            <div
              key={record.id}
              className="w-full bg-primary-bg border border-primary-border rounded-[10px] p-[3px]"
            >
              <h3 className="text-primary-text font-dotgothic text-lg mb-[10px] px-[10px] py-[5px]">
                {record.exerciseName}
              </h3>
              {/* WorkoutRecordResponse には sets がないので、別途取得する必要がある */}
              {/* 詳細表示は別途実装 */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutDayDetail;