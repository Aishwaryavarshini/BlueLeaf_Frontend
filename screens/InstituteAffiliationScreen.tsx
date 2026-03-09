
import React, { useState } from 'react';

interface InstituteAffiliationScreenProps {
  onContinue: (name: string) => void;
  onBack: () => void;
}

const InstituteAffiliationScreen: React.FC<InstituteAffiliationScreenProps> = ({ onContinue, onBack }) => {
  const [instituteName, setInstituteName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (instituteName.trim().length === 0) {
      setError('Please enter your institute name to continue');
      return;
    }
    onContinue(instituteName);
  };

  return (
    <div className="h-full flex flex-col bg-white relative animate-fade-in">
      {/* Header */}
      <div className="pt-12 px-6 pb-6">
        <button 
          onClick={onBack}
          className="mb-6 p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-slate-900 leading-tight">Enter your institute name</h2>
        <p className="text-slate-500 mt-2 text-lg">This helps us load your syllabus and notes correctly</p>
      </div>

      {/* Input Area */}
      <div className="flex-1 px-6 pt-4">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700 ml-1">Institute Name</label>
          <div className="relative group">
            <input
              type="text"
              value={instituteName}
              onChange={(e) => {
                setInstituteName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Tamil Nadu Government School"
              className={`w-full p-5 rounded-2xl border-2 bg-slate-50/50 text-slate-900 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium ${
                error ? 'border-red-400 focus:border-red-500' : 'border-slate-100 focus:border-blue-500'
              }`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-50 transition-opacity">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"></path>
                <path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3"></path>
                <path d="M12 3v18"></path>
              </svg>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-500 font-bold ml-1 animate-slide-up">
              {error}
            </p>
          )}
          <p className="text-[11px] text-slate-400 font-medium ml-1 leading-relaxed">
            Institute mapping ensures your materials are syllabus-aligned.
          </p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-6 bg-white border-t border-slate-50">
        <button
          disabled={instituteName.trim().length === 0}
          onClick={handleContinue}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
            instituteName.trim().length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default InstituteAffiliationScreen;
