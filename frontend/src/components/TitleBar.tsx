import React from 'react';

const TitleBar: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-6 bg-surface-secondary rounded-[10px] px-2 py-[33px]">
      <div className="text-content-secondary font-dotgothic text-base">
        lift_log
      </div>
    </div>
  );
};

export default TitleBar; 