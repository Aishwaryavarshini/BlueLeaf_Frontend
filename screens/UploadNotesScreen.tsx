
import React, { useState } from 'react';
import { UserPreferences } from '../App';
import DashboardHeader from '../components/DashboardHeader';

interface UploadNotesScreenProps {
  preferences: UserPreferences;
  onBack: () => void;
  onComplete: () => void;
}

const SUBJECTS = [
  'Mathematics',
  'Tamil',
  'English',
  'Science',
  'Social Science'
];

const UNITS_MAP: Record<string, string[]> = {
  'Mathematics': ['Algebra', 'Set Language', 'Real Numbers', 'Geometry', 'Trigonometry'],
  'Science': ['Measurements', 'Motion', 'Fluids', 'Work and Energy', 'Heat'],
  'English': ['Prose', 'Poetry', 'Supplementary', 'Grammar'],
  'Tamil': ['இயல் 1', 'இயல் 2', 'இயல் 3', 'இயல் 4'],
  'Social Science': ['History', 'Geography', 'Civics', 'Economics']
};

const LESSONS_MAP: Record<string, string[]> = {
  'Algebra': ['Polynomials', 'Identities', 'Factoring', 'Equations'],
  'Geometry': ['Lines and Angles', 'Triangles', 'Quadrilaterals', 'Circles'],
};

const UploadNotesScreen: React.FC<UploadNotesScreenProps> = ({ preferences, onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    if (step === 1) onBack();
    else setStep(prev => prev - 1);
  };

  const startUpload = () => {
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('success');
      setTimeout(onComplete, 1500);
    }, 2000);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-4">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Subject</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Step 1 of 4</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => { setSelectedSubject(s); handleNext(); }}
                  className="p-6 bg-white border-2 border-[#2563eb]/10 rounded-[2rem] text-left font-bold text-slate-800 transition-all active:scale-[0.98] active:border-[#2563eb] active:bg-blue-50 shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-4">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Unit</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Step 2 of 4</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {(UNITS_MAP[selectedSubject] || []).map(u => (
                <button
                  key={u}
                  onClick={() => { setSelectedUnit(u); handleNext(); }}
                  className="p-6 bg-white border-2 border-[#2563eb]/10 rounded-[2rem] text-left font-bold text-slate-800 transition-all active:scale-[0.98] active:border-[#2563eb] active:bg-blue-50 shadow-sm"
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-4">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Specify Lesson</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Step 3 of 4</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {(LESSONS_MAP[selectedUnit] || []).map(l => (
                <button
                  key={l}
                  onClick={() => { setSelectedLesson(l); handleNext(); }}
                  className="p-6 bg-white border-2 border-[#2563eb]/10 rounded-[2rem] text-left font-bold text-slate-800 transition-all active:scale-[0.98] active:border-[#2563eb] active:bg-blue-50 shadow-sm"
                >
                  {l}
                </button>
              ))}
              <button
                onClick={() => { setSelectedLesson(''); handleNext(); }}
                className="p-8 bg-white border-2 border-dashed border-[#2563eb]/20 text-[#2563eb]/40 rounded-[2.5rem] text-center font-black uppercase tracking-widest text-[10px] active:scale-[0.98] active:bg-blue-50 active:border-solid transition-all"
              >
                Skip Specific Lesson
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="bg-white rounded-[3rem] p-10 border-2 border-[#2563eb]/10 shadow-2xl">
               <h4 className="font-black text-[#2563eb] text-[10px] uppercase tracking-[0.3em] mb-6">Target Location</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <span className="text-slate-400 font-bold text-xs uppercase">Subject</span>
                    <span className="text-slate-900 font-black uppercase text-sm">{selectedSubject}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <span className="text-slate-400 font-bold text-xs uppercase">Unit</span>
                    <span className="text-slate-900 font-black uppercase text-sm">{selectedUnit}</span>
                  </div>
                  {selectedLesson && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold text-xs uppercase">Lesson</span>
                      <span className="text-slate-900 font-black uppercase text-sm">{selectedLesson}</span>
                    </div>
                  )}
               </div>
            </div>

            <div className="flex flex-col items-center justify-center py-10">
               {uploadStatus === 'idle' ? (
                 <div className="w-full flex flex-col items-center">
                    <button
                      onClick={startUpload}
                      className="w-full bg-white border-2 border-[#2563eb] border-dashed p-14 rounded-[3.5rem] flex flex-col items-center justify-center space-y-6 active:scale-[0.98] active:bg-blue-50 active:border-solid transition-all group shadow-sm"
                    >
                      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center border-2 border-[#2563eb]/10 group-active:bg-white transition-all shadow-inner">
                        <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="font-black text-[#2563eb] uppercase tracking-[0.25em] text-xs">Choose File</p>
                        <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase">PDF or Scanned Scans</p>
                      </div>
                    </button>
                 </div>
               ) : uploadStatus === 'uploading' ? (
                 <div className="text-center bg-white p-12 rounded-[3.5rem] border-2 border-[#2563eb]/10 shadow-2xl w-full">
                    <div className="w-16 h-16 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">AI Indexing</h3>
                    <p className="text-slate-400 font-black uppercase tracking-[0.15em] text-[10px] mt-2">Analyzing handwritten context...</p>
                 </div>
               ) : (
                 <div className="text-center bg-white p-12 rounded-[3.5rem] border-2 border-green-100 shadow-2xl w-full animate-bounce">
                    <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border-2 border-green-100">
                      <svg viewBox="0 0 24 24" className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-green-600 uppercase tracking-tight">Success!</h3>
                 </div>
               )}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col relative animate-fade-in overflow-hidden">
      {/* GLOBAL STATIC BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />
      <DashboardHeader preferences={preferences} title="Upload Notes" />

      {/* Control Bar */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-[136px] bg-transparent z-20 relative z-10">
        <button onClick={handleBack} className="flex items-center bg-white border-2 border-[#2563eb] text-[#2563eb] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-[0.98] active:bg-blue-50 transition-all shadow-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          <span>Back</span>
        </button>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 shadow-sm ${step >= i ? 'w-6 bg-yellow-400' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10">
        {renderStep()}
      </div>
    </div>
  );
};

export default UploadNotesScreen;
