import React from 'react';

interface CalendarButtonProps {
  onClick: () => void;
}

const CalendarButton: React.FC<CalendarButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full bg-primary-border hover:bg-primary-accent/20 rounded-[10px] p-[10px] transition-colors active:scale-95 transform duration-150"
    >
      <div className="flex items-center space-x-[10px]">
        <div className="text-primary-text font-dotgothic text-lg">
          📅
        </div>
        <div className="text-primary-text font-dotgothic text-base">
          カレンダーで見る
        </div>
      </div>
    </button>
  );
};

export default CalendarButton;