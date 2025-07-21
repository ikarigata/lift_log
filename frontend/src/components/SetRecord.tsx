import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SetRecordProps {
  setNumber: number;
  weight: number;
  reps: number;
  isCompleted: boolean;
}

const SetRecord: React.FC<SetRecordProps> = ({ setNumber, weight, reps, isCompleted }) => {
  return (
    <div className="flex items-center w-full h-6 border-b border-primary-border px-2.5 py-1.5">
      <div className="text-primary-text font-dotgothic text-base">
        {setNumber}セット目
      </div>
      <div className="text-primary-text font-dotgothic text-base ml-2.5">
        {weight}kg
      </div>
      <div className="text-primary-text font-dotgothic text-base mx-2.5">
        ×
      </div>
      <div className="text-primary-text font-dotgothic text-base">
        {reps}回
      </div>
      <div className="flex-grow" />
      {isCompleted && (
        <CheckCircleIcon className="h-5 w-5 text-primary-accent" />
      )}
    </div>
  );
};

export default SetRecord; 