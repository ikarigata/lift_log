import React from 'react';

interface CalendarButtonProps {
  onClick: () => void;
}

const CalendarButton: React.FC<CalendarButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full bg-interactive-secondary rounded-[10px] p-[10px] border-none transition-colors transform duration-150 glitch-on-click glitch-on-hover"
    >
      <div className="flex items-center space-x-[10px]">
        <div className="text-content-secondary font-dotgothic text-lg">
          📅
        </div>
        <div className="text-content-secondary font-dotgothic text-base">
          カレンダーで見る
        </div>
      </div>
    </button>
  );
};

export default CalendarButton;