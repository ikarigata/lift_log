import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

interface Props {
  children?: React.ReactNode;
  onBack?: () => void;
}

const TitleBar: React.FC<Props> = ({ children, onBack }) => {
  const defaultTitle = <span className="font-dotgothic text-base">lift_log</span>;

  return (
    <div className="flex items-center justify-between w-full h-6 bg-titlebar-bg rounded-[10px] px-[10px] py-[33px]">
      {onBack ? (
        <button onClick={onBack} className="text-black hover:opacity-70 transition-opacity">
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      ) : (
        <div className="w-6" />
      )}
      <div className="text-black text-lg">
        {children || defaultTitle}
      </div>
      <div className="w-6" />
    </div>
  );
};

export default TitleBar; 