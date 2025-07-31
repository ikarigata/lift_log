import React from 'react';

interface AddWorkoutButtonProps {
  onClick: () => void;
}

const AddWorkoutButton: React.FC<AddWorkoutButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full bg-interactive-primary rounded-[10px] p-[10px] border-none transition-colors transform duration-150 glitch-on-click glitch-on-hover"
    >
      <div className="flex items-center space-x-[10px]">
        <div className="text-content-inverse font-dotgothic text-2xl">
          +
        </div>
        <div className="text-content-inverse font-dotgothic text-lg">
          新しいトレーニングを追加
        </div>
      </div>
    </button>
  );
};

export default AddWorkoutButton;