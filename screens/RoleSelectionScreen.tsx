
import React from 'react';

interface RoleSelectionScreenProps {
  onSelectStudent: () => void;
  onSelectInstitute: () => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectStudent, onSelectInstitute }) => {
  return (
    <div className="h-full flex flex-col bg-slate-50 p-6 animate-slide-up">
      <div className="mt-12 mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Who are you?</h2>
        <p className="text-slate-500 mt-2 text-lg">Select your role to get started with BlueLeaf</p>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        {/* Student Card */}
        <button
          onClick={onSelectStudent}
          className="flex flex-col items-start p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group active:scale-[0.99]"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-blue-600" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">I’m a Student</h3>
          <p className="text-slate-500 mt-1 leading-snug">
            Learn with syllabus-aligned paths and AI guidance
          </p>
        </button>

        {/* Institute Card */}
        <button
          onClick={onSelectInstitute}
          className="flex flex-col items-start p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left group active:scale-[0.99]"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-indigo-600" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18"></path>
              <path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3"></path>
              <path d="M19 21v-4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"></path>
              <path d="M1 21v-4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"></path>
              <path d="M3 7l9-4 9 4"></path>
              <path d="M12 3v18"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">I’m from an Institute</h3>
          <p className="text-slate-500 mt-1 leading-snug">
            Manage classes and track student learning
          </p>
        </button>
      </div>

      <div className="py-6 text-center">
        <p className="text-slate-400 text-sm">
          Trust & Clarity: Secure learning environment
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
