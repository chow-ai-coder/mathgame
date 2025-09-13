import React from 'react';
import PersonWalkingIcon from './icons/PersonWalkingIcon';
import FinishLineIcon from './icons/FinishLineIcon';

interface TimerBarProps {
  duration: number;
  timeLeft: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ duration, timeLeft }) => {
  // Calculate the percentage of time elapsed (0% at start, 100% at end)
  const progress = Math.min(100, Math.max(0, ((duration - timeLeft) / duration) * 100));

  return (
    <div className="w-full my-4 flex items-center h-12" aria-hidden="true">
      {/* The track itself is the main element, providing a relative positioning context */}
      <div className="flex-grow h-1 relative">
         {/* Dashed line for the track */}
         <div className="absolute top-1/2 left-0 right-0 h-0 border-t-2 border-dashed border-gray-500 -translate-y-1/2"></div>
         
         {/* Person icon moves along this track */}
         <div
           className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-cyan-300 transition-all duration-1000 ease-linear"
           style={{ left: `${progress}%` }}
         >
           <PersonWalkingIcon />
         </div>
      </div>

      {/* Finish line icon at the end */}
      <div className="ml-2 text-white">
        <FinishLineIcon />
      </div>
    </div>
  );
};

export default TimerBar;
