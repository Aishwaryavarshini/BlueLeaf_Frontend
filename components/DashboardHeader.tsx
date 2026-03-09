
import React from 'react';
import { UserPreferences } from '../App';
import FlameIcon from './FlameIcon';

interface DashboardHeaderProps {
  preferences: UserPreferences;
  title: string;
  onProfileClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ preferences, title, onProfileClick }) => {
  return (
    <header className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-30 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        {/* Profile Area: Clickable but looks like text/avatar only, no button background */}
        <button 
          onClick={onProfileClick}
          className="flex items-center space-x-3 active:opacity-80 transition-all cursor-pointer relative"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center text-white text-sm font-black shadow-sm">
            {preferences.username[0]}
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1">
              <span className="text-slate-900 font-black uppercase tracking-tight text-xs leading-none active:text-slate-700">
                {preferences.username}
              </span>
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#2563eb]/40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <p className="text-[9px] font-black text-[#2563eb]/60 uppercase tracking-[0.15em] mt-1">
              Grade {preferences.selectedClass}
            </p>
          </div>
        </button>

        {/* Streak Indicator Component */}
        <FlameIcon streak={preferences.streak} />
      </div>
      
      <h1 className="text-2xl font-black text-slate-500 leading-tight uppercase tracking-tight">{title}</h1>
      <div className="flex items-center space-x-2 mt-1 opacity-60">
        <div className="w-1 h-1 bg-[#2563eb] rounded-full"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {preferences.language} Medium · {preferences.belongsToInstitute ? preferences.instituteName : 'BlueLeaf Learner'}
        </p>
      </div>
    </header>
  );
};

export default DashboardHeader;
