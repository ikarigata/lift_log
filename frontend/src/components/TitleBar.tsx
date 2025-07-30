import React from 'react';

interface TitleBarProps {
  title: string | React.ReactNode;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-center w-full bg-surface-secondary rounded-[10px] px-4 py-4">
      <div className="text-content-accent font-dotgothic text-xl">
        {title}
      </div>
    </div>
  );
};

export default TitleBar; 