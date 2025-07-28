import React, { useState } from 'react';
import TitleBar from './TitleBar';
import type { Exercise } from '../types';

interface ExerciseManagementProps {
  exercises: Exercise[];
  onBack: () => void;
  onAddExercise: (name: string, muscleGroup: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onToggleFavorite: (exerciseId: string) => void;
  onLogout: () => void;
}

const ExerciseManagement: React.FC<ExerciseManagementProps> = ({
  exercises,
  onBack: _onBack,
  onAddExercise,
  onDeleteExercise,
  onToggleFavorite,
  onLogout
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newMuscleGroup, setNewMuscleGroup] = useState('');

  const muscleGroups = ['胸', '背中', '肩', '腕', '脚', '腹筋', 'その他'];

  const handleAddExercise = () => {
    if (newExerciseName.trim() && newMuscleGroup.trim()) {
      onAddExercise(newExerciseName.trim(), newMuscleGroup);
      setNewExerciseName('');
      setNewMuscleGroup('');
      setShowAddForm(false);
    }
  };

  const handleDeleteExercise = (exerciseId: string, exerciseName: string) => {
    if (confirm(`「${exerciseName}」を削除しますか？\n関連するトレーニング記録も削除されます。`)) {
      onDeleteExercise(exerciseId);
    }
  };

  const exercisesByMuscleGroup = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.muscleGroup]) {
      acc[exercise.muscleGroup] = [];
    }
    acc[exercise.muscleGroup].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <div className="w-full px-2 py-4 space-y-[10px] bg-surface-primary min-h-screen">
      <TitleBar title="Exercise Management" onLogout={onLogout} />

      {/* Add Exercise Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="flex items-center justify-center w-full bg-interactive-primary hover:bg-interactive-primary/80 rounded-[10px] p-[10px] transition-colors active:scale-95 transform duration-150"
      >
        <div className="flex items-center space-x-[10px]">
          <div className="text-content-inverse font-dotgothic text-2xl">
            +
          </div>
          <div className="text-content-inverse font-dotgothic text-lg">
            新しい種目を追加
          </div>
        </div>
      </button>

      {/* Add Exercise Form */}
      {showAddForm && (
        <div className="bg-surface-secondary border border-content-primary rounded-[10px] p-[10px] space-y-[10px]">
          <h3 className="text-interactive-primary font-dotgothic text-lg text-left">新しい種目</h3>
          
          <div className="space-y-[5px]">
            <label className="text-content-secondary font-dotgothic text-sm opacity-80">種目名</label>
            <input
              type="text"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              placeholder="例：ベンチプレス"
              className="w-full bg-input-bg text-input-text font-dotgothic rounded-[5px] px-[5px] py-[8px]"
            />
          </div>

          <div className="space-y-[5px]">
            <label className="text-content-secondary font-dotgothic text-sm opacity-80">部位</label>
            <select
              value={newMuscleGroup}
              onChange={(e) => setNewMuscleGroup(e.target.value)}
              className="w-full bg-input-bg text-input-text font-dotgothic rounded-[5px] px-[5px] py-[8px]"
            >
              <option value="">部位を選択</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-[10px]">
            <button
              onClick={handleAddExercise}
              disabled={!newExerciseName.trim() || !newMuscleGroup.trim()}
              className="flex-1 bg-interactive-primary hover:bg-interactive-primary/80 disabled:bg-gray-500 disabled:opacity-50 rounded-[5px] px-[5px] py-[8px] text-content-inverse font-dotgothic text-sm transition-colors"
            >
              追加
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewExerciseName('');
                setNewMuscleGroup('');
              }}
              className="flex-1 bg-interactive-secondary hover:bg-interactive-secondary/80 rounded-[5px] px-[5px] py-[8px] text-content-secondary font-dotgothic text-sm transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* Exercise List by Muscle Group */}
      <div className="space-y-[15px]">
        {Object.entries(exercisesByMuscleGroup).map(([muscleGroup, groupExercises]) => (
          <div key={muscleGroup} className="bg-surface-secondary rounded-[10px] overflow-hidden">
            <div className="bg-surface-secondary px-[10px] py-[8px]">
              <h3 className="text-interactive-primary font-dotgothic text-lg text-left">
                {muscleGroup} ({groupExercises.length}種目)
              </h3>
            </div>
            <div className="p-[10px] space-y-[5px]">
              {groupExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between bg-surface-container rounded-[10px] p-[10px]"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-content-secondary font-dotgothic text-base">
                      {exercise.name}
                    </span>
                    {exercise.isFavorite && (
                      <span className="text-interactive-primary font-dotgothic text-sm">★</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onToggleFavorite(exercise.id)}
                      className={`rounded-[5px] px-[8px] py-[4px] font-dotgothic text-sm transition-colors ${
                        exercise.isFavorite
                          ? 'bg-surface-secondary text-interactive-primary hover:bg-surface-secondary/80'
                          : 'bg-surface-secondary text-white hover:bg-surface-secondary/80'
                      }`}
                    >
                      {exercise.isFavorite ? '★' : '☆'}
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(exercise.id, exercise.name)}
                      className="bg-interactive-primary hover:bg-interactive-primary/80 rounded-[5px] px-[10px] py-[4px] text-surface-primary font-dotgothic text-sm transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-content-primary opacity-60 font-dotgothic text-lg mb-2">
            まだ種目が登録されていません
          </div>
          <div className="text-content-primary opacity-40 font-dotgothic text-sm">
            上のボタンから新しい種目を追加しましょう
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseManagement;