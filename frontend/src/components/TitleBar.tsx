import React from 'react';

interface TitleBarProps {
  title: string;
  onLogout: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({ title, onLogout }) => {
  return (
    <div className="flex items-center justify-between w-full h-6 bg-surface-secondary rounded-[10px] px-4 py-[33px]">
      <div className="text-content-secondary font-dotgothic text-xl">
        {title}
      </div>
      <button
        onClick={onLogout}
        className="px-3 py-1 bg-interactive-secondary text-content-secondary text-sm rounded hover:bg-interactive-secondary/80"
      >
        ログアウト
      </button>
    </div>
  );
};

export default TitleBar; 