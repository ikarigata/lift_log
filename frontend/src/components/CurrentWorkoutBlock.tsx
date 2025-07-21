import React from 'react';
import SetRecord from './SetRecord';

interface CurrentWorkoutBlockProps {
  exerciseName: string;
  sets: Array<{
    setNumber: number;
    weight: number;
    reps: number;
  }>;
  onSetChange: (setNumber: number, weight: number, reps: number) => void;
}

const CurrentWorkoutBlock: React.FC<CurrentWorkoutBlockProps> = ({
  exerciseName,
  sets,
  onSetChange,
}) => {
  return (
    <div className="flex flex-col w-full bg-[#26272A] rounded-lg p-3">
      <div className="flex items-center justify-center w-full h-[49px] bg-[#E86029] rounded-md px-5 py-2.5">
        <div className="text-[#26272A] font-['DotGothic16'] text-xl">
          {exerciseName}
        </div>
      </div>
      <div className="flex flex-col w-full mt-2.5">
        {sets.map((set) => (
          <div
            key={set.setNumber}
            className="flex items-center w-full h-6 border-b border-[#3B3C3F] px-2.5 py-1.5"
          >
            <div className="text-[#F1EFDF] font-['DotGothic16'] text-base">
              {set.setNumber}セット目
            </div>
            <input
              type="number"
              value={set.weight}
              onChange={(e) =>
                onSetChange(set.setNumber, Number(e.target.value), set.reps)
              }
              className="w-16 h-6 ml-2.5 bg-transparent text-[#F1EFDF] font-['DotGothic16'] text-base border-none focus:outline-none"
            />
            <div className="text-[#F1EFDF] font-['DotGothic16'] text-base mx-2.5">
              ×
            </div>
            <input
              type="number"
              value={set.reps}
              onChange={(e) =>
                onSetChange(set.setNumber, set.weight, Number(e.target.value))
              }
              className="w-16 h-6 bg-transparent text-[#F1EFDF] font-['DotGothic16'] text-base border-none focus:outline-none"
            />
            <div className="text-[#F1EFDF] font-['DotGothic16'] text-base ml-2.5">
              回
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentWorkoutBlock; 