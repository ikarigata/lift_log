import React from 'react';

interface ExerciseManagementButtonProps {
  onClick: () => void;
}

const ExerciseManagementButton: React.FC<ExerciseManagementButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full bg-interactive-secondary rounded-[10px] p-[10px] border-none transition-colors transform duration-150 glitch-on-click glitch-on-hover"
    >
      <div className="flex items-center space-x-[10px]">
        <div className="text-content-secondary font-dotgothic text-lg">
          ⚙️
        </div>
        <div className="text-content-secondary font-dotgothic text-base">
          種目管理
        </div>
      </div>
    </button>
  );
};

export default ExerciseManagementButton;