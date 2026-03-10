
import React from 'react';

interface PrincipalClassViewScreenProps {
  className: string;
  onBack: () => void;
  onSelectSubject: (subjectName: string) => void;
  onGoToDashboard: () => void;
}

const SUBJECTS = [
  { name: 'Tamil', mastery: 85, students: 120, completion: 78 },
  { name: 'English', mastery: 82, students: 120, completion: 85 },
  { name: 'Mathematics', mastery: 76, students: 120, completion: 72 },
  { name: 'Science', mastery: 88, students: 120, completion: 90 },
  { name: 'Social Science', mastery: 91, students: 120, completion: 94 },
];

const PrincipalClassViewScreen: React.FC<PrincipalClassViewScreenProps> = ({ className, onBack, onSelectSubject, onGoToDashboard }) => {
  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-[#eff6ff] animate-fade-in">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f0f7ff] h-32 shadow-lg flex flex-col px-6 justify-center">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 mb-2">
          <button onClick={onGoToDashboard} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Principal Dashboard</button>
          <span className="text-slate-300 text-[10px] font-black">/</span>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Class {className}</span>
        </nav>

        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="p-3 bg-transparent text-[#2563eb] rounded-2xl shadow-lg border-2 border-[#2563eb]/20 active:scale-95 active:bg-[#2563eb]/10 transition-all active:border-[#2563eb] mr-4"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col text-[#2563eb]">
            <h1 className="text-xl font-black uppercase leading-tight">Class {className} Performance Overview</h1>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-0.5">Subject Performance Summary</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-40 pb-20 relative z-10 space-y-8">
        <section className="animate-slide-up">
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 ml-2 drop-shadow-md">Select Subject for Detailed Oversight</h2>
          <div className="grid grid-cols-1 gap-4">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.name}
                onClick={() => onSelectSubject(subject.name)}
                className="bg-[#f0f7ff] p-6 rounded-[2.5rem] border-2 border-blue-50 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.08)] flex flex-col active:border-[#2563eb] active:ring-4 active:ring-[#2563eb]/10 active:bg-blue-50/50 transition-all text-left relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-black text-slate-800 leading-tight uppercase tracking-tight">{subject.name}</h4>
                  <div className="px-4 py-1.5 bg-blue-50 rounded-full">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{subject.mastery}% Mastery</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${subject.mastery}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrincipalClassViewScreen;
