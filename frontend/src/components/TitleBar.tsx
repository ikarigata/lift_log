import React from 'react';

const TitleBar: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-6 bg-[#26272A] rounded-lg px-[86px] py-[33px]">
      <div className="text-[#F1EFDF] font-['DotGothic16'] text-base">
        タイトルロゴ
      </div>
    </div>
  );
};

export default TitleBar; 