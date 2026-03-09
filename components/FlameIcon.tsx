
import React from 'react';

const FlameIcon: React.FC<{ streak: number }> = ({ streak }) => {
  return (
    <div className="flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
      <div className="relative w-5 h-5 flex items-center justify-center mr-1.5">
        {/* Subtle Glow Pulse Shimmer */}
        <div className="absolute inset-0 bg-[#2563eb]/10 rounded-full blur-[6px] animate-[glow-pulse_3s_ease-in-out_infinite]"></div>
        
        {/* Blue Flame Icon with Shimmer Animation */}
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full relative z-10 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2c0 0-6 7-6 12s5 8 6 8s6-3 6-8s-6-12-6-12zM12 18c-2.2 0-4-1.8-4-4 0-2.2 4-7 4-7s4 4.8 4 7c0 2.2-1.8 4-4 4z" 
            fill="#2563eb"
            className="animate-[flicker-shimmer_4s_ease-in-out_infinite]"
          />
        </svg>
      </div>
      <span className="text-[#2563eb] font-black text-sm leading-none">
        {streak}
      </span>

      <style>{`
        @keyframes flicker-shimmer {
          0%, 100% { 
            transform: translateY(0); 
            opacity: 1; 
          }
          50% { 
            transform: translateY(-1.5px); 
            opacity: 0.85; 
          }
        }
        @keyframes glow-pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.2; 
          }
          50% { 
            transform: scale(1.3); 
            opacity: 0.4; 
          }
        }
      `}</style>
    </div>
  );
};

export default FlameIcon;
