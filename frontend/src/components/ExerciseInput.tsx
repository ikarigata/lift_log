import React, { useState } from 'react';
import type { Exercise, WorkoutRecord, WorkoutSet } from '../types';

interface ExerciseInputProps {
  exercise: Exercise;
  previousRecords: WorkoutRecord[];
  currentRecord?: WorkoutRecord | null;
  onBack: () => void;
  onSave: (sets: WorkoutSet[], memo?: string) => void;
}

const ExerciseInput: React.FC<ExerciseInputProps> = ({ 
  exercise, 
  previousRecords, 
  currentRecord,
  onBack, 
  onSave 
}) => {
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>(
    currentRecord ? currentRecord.sets : [
      { setNumber: 1, weight: 0, reps: 0 }
    ]
  );
  const [memo, setMemo] = useState<string>(currentRecord?.memo || '');

  const addSet = () => {
    const newSet: WorkoutSet = {
      setNumber: currentSets.length + 1,
      weight: currentSets[currentSets.length - 1]?.weight || 0,
      reps: currentSets[currentSets.length - 1]?.reps || 0
    };
    setCurrentSets([...currentSets, newSet]);
  };

  const updateSet = (index: number, field: keyof WorkoutSet, value: number) => {
    const updatedSets = [...currentSets];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    setCurrentSets(updatedSets);
  };

  const removeSet = (index: number) => {
    if (currentSets.length > 1) {
      const updatedSets = currentSets.filter((_, i) => i !== index);
      const renumberedSets = updatedSets.map((set, i) => ({ ...set, setNumber: i + 1 }));
      setCurrentSets(renumberedSets);
    }
  };

  const handleSave = () => {
    onSave(currentSets, memo);
  };

  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <div className="mb-[15px]">
        <div className="w-full bg-surface-secondary rounded-[10px] px-[15px] py-[10px] text-center mb-[10px]">
          <h1 className="text-surface-primary font-dotgothic text-xl">
            Exercise Input
          </h1>
          <p className="text-surface-primary opacity-80 font-dotgothic text-sm">
            {exercise.name} - {exercise.muscleGroup}
          </p>
        </div>
      </div>

      {previousRecords.filter(record => record.id !== currentRecord?.id).length > 0 && (
        <div className="bg-surface-secondary rounded-[10px] p-[10px] border border-white mb-[20px]">
          <div className="bg-surface-secondary text-interactive-primary rounded-[5px] px-[10px] py-[5px] mb-[10px]">
            <h3 className="text-interactive-primary font-dotgothic text-lg text-left">
              過去の記録
            </h3>
          </div>
          {previousRecords
            .filter(record => record.id !== currentRecord?.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 2)
            .reverse()
            .map((record, recordIndex) => (
            <div
              key={record.id}
              className="bg-surface-container rounded-[10px] p-[10px] mb-[15px]"
            >
              <div className="flex items-center justify-between mb-[5px]">
                <div className="text-content-secondary opacity-60 font-dotgothic text-sm">
                  {new Date(record.createdAt).toLocaleDateString('ja-JP')} ({new Date(record.createdAt).toLocaleDateString('ja-JP', { weekday: 'short' })})
                </div>
                <div className="text-content-secondary opacity-40 font-dotgothic text-xs">
                  {recordIndex === 0 ? '前々回' : '前回'}
                </div>
              </div>
              <div className="space-y-[5px]">
                {record.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex justify-between py-[2px]">
                    <span className="text-content-secondary font-dotgothic text-sm opacity-80">
                      {set.setNumber}セット目
                    </span>
                    <span className="text-content-secondary font-dotgothic text-sm opacity-80">
                      {set.weight}kg <span className="text-content-secondary">×</span> {set.reps}回
                    </span>
                  </div>
                ))}
                <hr className="border-content-secondary opacity-30 my-2" />
                <div className="flex gap-1">
                  <div className="bg-surface-container text-surface-primary text-xs font-dotgothic px-2 py-1 rounded-md text-center flex-1">
                    <div className="text-surface-primary opacity-80 mb-0.5">
                      総ボリューム
                    </div>
                    <div className="text-surface-primary">
                      {record.sets.reduce((total, set) => total + (set.weight * set.reps), 0).toLocaleString()}kg
                    </div>
                  </div>
                  <div className="bg-surface-container text-surface-primary text-xs font-dotgothic px-2 py-1 rounded-md text-center flex-1">
                    <div className="text-surface-primary opacity-80 mb-0.5">
                      1RM
                    </div>
                    <div className="text-surface-primary">
                      {record.sets.filter(set => set.reps > 0).length > 0 ? Math.max(...record.sets.filter(set => set.reps > 0).map(set => Math.round(set.weight * (1 + set.reps / 30)))).toLocaleString() : '0'}kg
                    </div>
                  </div>
                  <div className="bg-surface-container text-surface-primary text-xs font-dotgothic px-2 py-1 rounded-md text-center flex-1">
                    <div className="text-surface-primary opacity-80 mb-0.5">
                      5RM
                    </div>
                    <div className="text-surface-primary">
                      {record.sets.filter(set => set.reps > 0).length > 0 ? Math.max(...record.sets.filter(set => set.reps > 0).map(set => Math.round(set.weight * (1 + set.reps / 30) * 0.87))).toLocaleString() : '0'}kg
                    </div>
                  </div>
                </div>
                {record.memo && (
                  <div className="mt-2 pt-2 border-t border-content-secondary border-opacity-20">
                    <div className="text-content-secondary opacity-60 font-dotgothic text-xs mb-1">
                      メモ
                    </div>
                    <div className="text-content-secondary opacity-80 font-dotgothic text-sm">
                      {record.memo}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface-secondary rounded-[10px] p-[10px] border border-white">
        <div className="bg-surface-secondary text-interactive-primary rounded-[5px] px-[10px] py-[5px] mb-[10px] flex items-center justify-between">
          <h3 className="text-interactive-primary font-dotgothic text-lg text-left">
            今回の記録
          </h3>
          <button
            onClick={addSet}
            className="bg-interactive-primary hover:bg-interactive-primary/80 rounded-[5px] px-[10px] py-[5px] text-surface-primary font-dotgothic text-sm transition-colors"
          >
            + セット追加
          </button>
        </div>

        <div className="space-y-[10px]">
          {currentSets.map((set, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-surface-container rounded-[10px] p-[10px] mb-[10px]"
            >
              <div className="flex items-center space-x-[10px]">
                <span className="text-content-secondary font-dotgothic text-sm w-[80px] flex-shrink-0">
                  {set.setNumber}セット目
                </span>
                
                <div className="flex items-center space-x-[5px]">
                  <input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                    placeholder="重量"
                    className="w-[72px] bg-surface-container text-content-secondary font-dotgothic text-sm rounded-[5px] px-[5px] py-[2px] text-center border border-gray-400"
                  />
                  <span className="text-content-secondary font-dotgothic text-sm">kg</span>
                </div>

                <span className="text-content-secondary font-dotgothic text-sm">×</span>

                <div className="flex items-center space-x-[5px]">
                  <input
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                    placeholder="回数"
                    className="w-[60px] bg-surface-container text-content-secondary font-dotgothic text-sm rounded-[5px] px-[5px] py-[2px] text-center border border-gray-400"
                  />
                  <span className="text-content-secondary font-dotgothic text-sm">回</span>
                </div>
              </div>

              {currentSets.length > 1 && (
                <button
                  onClick={() => removeSet(index)}
                  className="text-interactive-primary font-dotgothic text-sm hover:opacity-70 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-[10px] mt-[10px]">
          <div className="bg-surface-container text-surface-primary text-xs font-dotgothic px-2 py-1 rounded-md text-center flex-1">
            <div className="text-surface-primary opacity-80 mb-0.5">
              総ボリューム
            </div>
            <div className="text-surface-primary">
              {currentSets.reduce((total, set) => total + (set.weight && set.reps ? set.weight * set.reps : 0), 0).toLocaleString()}kg
            </div>
          </div>
          <div className="bg-surface-container text-surface-primary text-xs font-dotgothic px-2 py-1 rounded-md text-center flex-1">
            <div className="text-surface-primary opacity-80 mb-0.5">
              1RM
            </div>
            <div className="text-surface-primary">
              {currentSets.filter(set => set.weight > 0 && set.reps > 0).length > 0 ? Math.max(...currentSets.filter(set => set.weight > 0 && set.reps > 0).map(set => Math.round(set.weight * (1 + set.reps / 30)))).toLocaleString() : '0'}kg
            </div>
          </div>
          <div className="bg-surface-container text-surface-primary text-xs font-dotgothic px-2 py-1 rounded-md text-center flex-1">
            <div className="text-surface-primary opacity-80 mb-0.5">
              5RM
            </div>
            <div className="text-surface-primary">
              {currentSets.filter(set => set.weight > 0 && set.reps > 0).length > 0 ? Math.max(...currentSets.filter(set => set.weight > 0 && set.reps > 0).map(set => Math.round(set.weight * (1 + set.reps / 30) * 0.87))).toLocaleString() : '0'}kg
            </div>
          </div>
        </div>
        
        <div className="bg-surface-secondary rounded-[10px] p-[10px] mt-[10px]">
          <div className="bg-surface-secondary text-interactive-primary rounded-[5px] px-[10px] py-[5px] mb-[10px]">
            <h3 className="text-interactive-primary font-dotgothic text-lg text-left">
              メモ
            </h3>
          </div>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="今日のトレーニングメモを入力..."
            className="w-full bg-input-bg text-input-text font-dotgothic rounded-[5px] px-[10px] py-[10px] resize-none"
            rows={3}
          />
        </div>
        
        <button 
          onClick={handleSave}
          className="w-full bg-interactive-primary hover:bg-interactive-primary/80 text-surface-primary font-dotgothic text-base rounded-[10px] px-[10px] py-[10px] mt-[10px] transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default ExerciseInput;