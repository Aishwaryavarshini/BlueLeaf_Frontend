
import React from 'react';
import { UserPreferences } from '../App';
import DashboardHeader from '../components/DashboardHeader';

interface Formula {
  id: string;
  name: string;
  expression: string;
  explanation: string;
}

interface KeyFormulasScreenProps {
  preferences: UserPreferences;
  unitName: string;
  onBack: () => void;
}

const ALGEBRA_FORMULAS: Formula[] = [
  {
    id: '1',
    name: 'Square of a Sum',
    expression: '(a + b)² = a² + 2ab + b²',
    explanation: 'Used to expand the square of the sum of two terms.'
  },
  {
    id: '2',
    name: 'Square of a Difference',
    expression: '(a - b)² = a² - 2ab + b²',
    explanation: 'Used to expand the square of the difference of two terms.'
  },
  {
    id: '3',
    name: 'Difference of Squares',
    expression: 'a² - b² = (a + b)(a - b)',
    explanation: 'Used to factorize the difference of two square terms.'
  },
  {
    id: '4',
    name: 'Cube of a Sum',
    expression: '(a + b)³ = a³ + 3a²b + 3ab² + b³',
    explanation: 'The cubic expansion for the sum of two terms.'
  },
  {
    id: '5',
    name: 'Cube of a Difference',
    expression: '(a - b)³ = a³ - 3a²b + 3ab² - b³',
    explanation: 'The cubic expansion for the difference of two terms.'
  }
];

const KeyFormulasScreen: React.FC<KeyFormulasScreenProps> = ({ preferences, unitName, onBack }) => {
  return (
    <div className="h-full flex flex-col relative animate-fade-in overflow-hidden">
      {/* GLOBAL STATIC BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />
      <DashboardHeader preferences={preferences} title="Formulas" />

      {/* Header controls */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-[136px] bg-transparent z-10 relative z-10">
        <button 
          onClick={onBack} 
          className="flex items-center bg-white border-2 border-[#2563eb] text-[#2563eb] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-[0.98] active:bg-blue-50 transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          <span>Path</span>
        </button>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">{unitName}</span>
      </div>

      {/* Formula List */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-8 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-10 border-2 border-[#2563eb]/10 shadow-2xl mt-4">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-3">Cheat Sheet</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                Master these essential identities for <span className="text-[#2563eb] font-bold">Grade {preferences.selectedClass}</span> level Algebra.
            </p>
        </div>

        {ALGEBRA_FORMULAS.map((formula) => (
          <div 
            key={formula.id}
            className="bg-white rounded-[2.5rem] border-2 border-[#2563eb]/10 shadow-lg p-8 space-y-6 active:scale-[0.99] active:border-[#2563eb] active:bg-blue-50 transition-all group"
          >
            <div className="flex justify-between items-center">
                <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">{formula.name}</h4>
                <button className="text-[#2563eb] opacity-30 active:opacity-100 transition-opacity">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
            </div>
            
            <div className="bg-slate-50 rounded-3xl p-8 flex items-center justify-center border-2 border-[#2563eb]/5 group-active:bg-white transition-all shadow-inner">
                <span className="text-2xl font-black text-[#2563eb] break-all text-center leading-normal">
                    {formula.expression}
                </span>
            </div>
            
            <p className="text-slate-500 text-xs font-bold leading-relaxed opacity-60">
                {formula.explanation}
            </p>
          </div>
        ))}

        <div className="p-10 text-center bg-white/20 backdrop-blur-md rounded-[3rem] border border-white/30 mb-10">
            <p className="text-white font-black uppercase tracking-[0.2em] text-[10px] leading-relaxed drop-shadow-sm">
                Pro Tip: Rewrite each 3x to master! ✍️
            </p>
        </div>
      </div>
    </div>
  );
};

export default KeyFormulasScreen;
