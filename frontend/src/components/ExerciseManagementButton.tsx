import React from 'react';

interface ExerciseManagementButtonProps {
  onClick: () => void;
}

const ExerciseManagementButton: React.FC<ExerciseManagementButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full bg-primary-border hover:bg-primary-accent/20 rounded-[10px] p-[10px] transition-colors active:scale-95 transform duration-150"
    >
      <div className="flex items-center space-x-[10px]">
        <div className="text-primary-text font-dotgothic text-lg">
          ⚙️
        </div>
        <div className="text-primary-text font-dotgothic text-base">
          種目管理
        </div>
      </div>
    </button>
  );
};

export default ExerciseManagementButton;