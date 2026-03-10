
import React from 'react';
import { UserPreferences } from '../App';
import DashboardHeader from '../components/DashboardHeader';

interface UnitListScreenProps {
  preferences: UserPreferences;
  subjectName: string;
  onBack: () => void;
  onSelectUnit: (unitName: string) => void;
  onProfileClick?: () => void;
}

const MATH_CLASS_9_UNITS = [
  "Set Language",
  "Real Numbers",
  "Algebra",
  "Geometry",
  "Coordinate Geometry",
  "Trigonometry",
  "Mensuration",
  "Statistics",
  "Probability"
];

const UnitListScreen: React.FC<UnitListScreenProps> = ({ preferences, subjectName, onBack, onSelectUnit, onProfileClick }) => {
  return (
    <div className="h-full flex flex-col relative animate-fade-in overflow-hidden bg-[#eff6ff]">
      <DashboardHeader 
        preferences={preferences} 
        title={`Grade ${preferences.selectedClass} – ${subjectName}`} 
        onProfileClick={onProfileClick}
      />

      {/* Breadcrumb / Back button area */}
      <div className="px-6 py-4 flex items-center relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center bg-[#f0f7ff] border-2 border-[#2563eb] text-[#2563eb] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest active:scale-[0.98] active:bg-blue-50 transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Dashboard</span>
        </button>
      </div>

      {/* Unit List */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10 mt-2">
        <div className="space-y-4">
          {MATH_CLASS_9_UNITS.map((unitName, index) => (
            <button
              key={index}
              onClick={() => onSelectUnit(unitName)}
              className="w-full bg-[#f0f7ff] p-6 rounded-[2.25rem] border-2 border-[#2563eb]/20 flex flex-col items-start active:scale-[0.98] active:border-[#2563eb] active:bg-blue-50 transition-all text-left relative group overflow-hidden shadow-sm"
            >
              <div className="flex justify-between w-full items-center mb-3">
                <span className="text-[#2563eb] font-black text-[10px] uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full border border-[#2563eb]/10">
                  Unit {index + 1}
                </span>
                
                <div className="flex space-x-1 opacity-20 group-active:opacity-100 transition-opacity">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 leading-tight">
                {unitName}
              </h3>
              
              <div className="mt-6 flex items-center text-[#2563eb] text-[10px] font-black uppercase tracking-widest opacity-60 group-active:opacity-100">
                <span>View Lesson Path</span>
                <svg viewBox="0 0 24 24" className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          ))}
        </div>
        
        <div className="py-16 flex flex-col items-center">
            <div className="w-12 h-1 bg-[#2563eb]/10 rounded-full mb-4"></div>
            <p className="text-[#2563eb]/40 text-[9px] font-black uppercase tracking-[0.25em]">TN Samacheer Syllabus</p>
        </div>
      </div>
    </div>
  );
};

export default UnitListScreen;
