import React from 'react';

interface SetRecordProps {
  setNumber: number;
  weight: number;
  reps: number;
}

const SetRecord: React.FC<SetRecordProps> = ({ setNumber, weight, reps }) => {
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
    </div>
  );
};

export default SetRecord; 