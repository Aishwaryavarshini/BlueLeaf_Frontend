
import React, { useState } from 'react';

interface ClassSelectionScreenProps {
  onContinue: (grade: number) => void;
  onBack: () => void;
}

const ClassSelectionScreen: React.FC<ClassSelectionScreenProps> = ({ onContinue, onBack }) => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const classes = Array.from({ length: 12 }, (_, i) => i + 1);

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
        <h2 className="text-3xl font-bold text-slate-900 leading-tight">Which class are you studying in?</h2>
        <p className="text-slate-500 mt-2 text-lg">Select your current grade</p>
      </div>

      {/* Class Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="grid grid-cols-3 gap-3">
          {classes.map((grade) => {
            const isSelected = selectedClass === grade;
            return (
              <button
                key={grade}
                onClick={() => setSelectedClass(grade)}
                className={`flex flex-col items-center justify-center aspect-square rounded-3xl border-2 transition-all duration-200 active:scale-[0.9] ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/5' 
                    : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                }`}
              >
                <span className={`text-2xl font-bold ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}>
                  {grade}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-blue-500/70' : 'text-slate-400'}`}>
                  Grade
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <button
          disabled={selectedClass === null}
          onClick={() => selectedClass !== null && onContinue(selectedClass)}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
            selectedClass !== null 
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ClassSelectionScreen;
