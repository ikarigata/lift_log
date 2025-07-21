import React, { useState, useMemo } from 'react';
import type { Exercise, WorkoutRecord, WorkoutSet } from '../types';
import { calculateVolume, calculate1RM } from '../utils/calculation';
interface ExerciseInputProps {
  exercise: Exercise;
  previousRecords: WorkoutRecord[];
  currentRecord?: WorkoutRecord | null;
  onBack: () => void;
  onSave: (sets: WorkoutSet[]) => void;
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
      { setNumber: 1, weight: 0, reps: 0, completed: false }
    ]
  );

  const addSet = () => {
    const newSet: WorkoutSet = {
      setNumber: currentSets.length + 1,
      weight: currentSets[currentSets.length - 1]?.weight || 0,
      reps: currentSets[currentSets.length - 1]?.reps || 0,
      completed: false
    };
    setCurrentSets([...currentSets, newSet]);
  };

  const updateSet = (index: number, field: keyof WorkoutSet, value: number | boolean) => {
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
    onSave(currentSets);
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
            {exercise.name}
          </h1>
          <p className="text-primary-text opacity-80 font-dotgothic text-sm">
            {exercise.muscleGroup}
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="text-primary-accent font-dotgothic text-base hover:opacity-70 transition-opacity"
        >
          保存
        </button>
      </div>

      {previousRecords.filter(record => record.id !== currentRecord?.id).length > 0 && (
        <div className="space-y-[10px] mb-[20px]">
          <h3 className="text-primary-text font-dotgothic text-lg opacity-80">
            過去の記録
          </h3>
          {previousRecords
            .filter(record => record.id !== currentRecord?.id)
            .slice(0, 2)
            .reverse()
            .map((record, recordIndex) => (
            <div
              key={record.id}
              className="bg-primary-bg border border-primary-border rounded-[10px] p-[10px]"
            >
              <div className="flex items-center justify-between mb-[5px]">
                <div className="text-primary-text opacity-60 font-dotgothic text-sm">
                  {new Date(record.createdAt).toLocaleDateString('ja-JP')}
                </div>
                <div className="text-primary-text opacity-40 font-dotgothic text-xs">
                  {recordIndex === 0 ? '前々回' : '前回'}
                </div>
              </div>
              <div className="space-y-[5px]">
                {record.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex justify-between py-[2px]">
                    <span className="text-primary-text font-dotgothic text-sm opacity-80">
                      {set.setNumber}セット目
                    </span>
                    <span className="text-primary-text font-dotgothic text-sm opacity-80">
                      {set.weight}kg <span className="text-white">×</span> {set.reps}回
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-[10px]">
        <div className="flex items-center justify-between">
          <h3 className="text-primary-text font-dotgothic text-lg">
            今回の記録
          </h3>
          <button
            onClick={addSet}
            className="bg-primary-accent hover:bg-primary-accent/80 rounded-[5px] px-[10px] py-[5px] text-primary-bg font-dotgothic text-sm transition-colors"
          >
            + セット追加
          </button>
        </div>

        <div className="space-y-[5px]">
          {currentSets.map((set, index) => (
            <div
              key={index}
              className="flex items-center space-x-[10px] bg-primary-bg border border-primary-border rounded-[10px] p-[10px]"
            >
              <span className="text-primary-text font-dotgothic text-sm w-[60px]">
                {set.setNumber}セット目
              </span>
              
              <div className="flex items-center space-x-[5px]">
                <input
                  type="number"
                  value={set.weight || ''}
                  onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                  placeholder="重量"
                  className="w-[60px] bg-primary-border text-primary-text font-dotgothic text-sm rounded-[5px] px-[5px] py-[2px] text-center"
                />
                <span className="text-primary-text font-dotgothic text-sm">kg</span>
              </div>

              <span className="text-white font-dotgothic text-sm">×</span>

              <div className="flex items-center space-x-[5px]">
                <input
                  type="number"
                  value={set.reps || ''}
                  onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                  placeholder="回数"
                  className="w-[50px] bg-primary-border text-primary-text font-dotgothic text-sm rounded-[5px] px-[5px] py-[2px] text-center"
                />
                <span className="text-primary-text font-dotgothic text-sm">回</span>
              </div>

              <button
                onClick={() => updateSet(index, 'completed', !set.completed)}
                className={`w-4 h-4 rounded-full transition-colors ${
                  set.completed ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />

              {currentSets.length > 1 && (
                <button
                  onClick={() => removeSet(index)}
                  className="text-red-500 font-dotgothic text-sm hover:opacity-70 transition-opacity ml-[5px]"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 mt-2.5">
          <div className="flex items-center justify-center w-full h-[66px] bg-primary-border rounded-lg px-2.5 py-1.5">
            <div className="text-primary-text font-dotgothic text-base">
              ボリューム: {useMemo(() => calculateVolume(currentSets), [currentSets]).toFixed(1)}kg
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-[66px] bg-primary-border rounded-lg px-2.5 py-1.5">
            <div className="text-primary-text font-dotgothic text-base">
              1RM: {useMemo(() => calculate1RM(currentSets), [currentSets]).toFixed(1)}kg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseInput;