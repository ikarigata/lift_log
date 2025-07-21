import React from 'react';

const TitleBar: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-6 bg-titlebar-bg rounded-[10px] px-[10px] py-[33px]">
      <div className="text-black font-dotgothic text-base">
        lift_log
      </div>
    </div>
  );
};

export default TitleBar; 