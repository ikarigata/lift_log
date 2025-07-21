import React from 'react';
import SetRecord from './SetRecord';

interface PreviousWorkoutBlockProps {
  date: string;
  sets: Array<{
    setNumber: number;
    weight: number;
    reps: number;
  }>;
  volume: number;
  oneRM: number;
}

const PreviousWorkoutBlock: React.FC<PreviousWorkoutBlockProps> = ({
  date,
  sets,
  volume,
  oneRM,
}) => {
  return (
    <div className="flex flex-col w-full bg-[#26272A] rounded-lg p-3">
      <div className="flex items-center w-full h-6 border-b border-[#3B3C3F] px-2.5 py-1">
        <div className="text-[#F1EFDF] font-['DotGothic16'] text-base">
          {date}
        </div>
      </div>
      <div className="flex flex-col w-full">
        {sets.map((set) => (
          <SetRecord
            key={set.setNumber}
            setNumber={set.setNumber}
            weight={set.weight}
            reps={set.reps}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2.5 mt-2.5">
        <div className="flex items-center justify-center w-full h-[66px] bg-[#3B3C3F] rounded-lg px-2.5 py-1.5">
          <div className="text-[#F1EFDF] font-['DotGothic16'] text-base">
            ボリューム: {volume}kg
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-[66px] bg-[#3B3C3F] rounded-lg px-2.5 py-1.5">
          <div className="text-[#F1EFDF] font-['DotGothic16'] text-base">
            1RM: {oneRM}kg
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousWorkoutBlock; 