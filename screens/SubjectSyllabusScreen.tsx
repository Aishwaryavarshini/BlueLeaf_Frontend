
import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../App';

interface MicroLesson {
  id: string;
  title: string;
}

interface Unit {
  id: string;
  title: string;
  lessons: MicroLesson[];
}

interface SubjectSyllabusScreenProps {
  preferences: UserPreferences;
  subjectName: string;
  className: string;
  onBack: () => void;
}

const SubjectSyllabusScreen: React.FC<SubjectSyllabusScreenProps> = ({
  preferences,
  subjectName,
  className,
  onBack
}) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [uploadFlow, setUploadFlow] = useState<'selection' | 'ebook' | 'notes_step1' | 'notes_step2' | 'notes_step3'>('selection');
  
  // States for flow logic
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLessonParent, setSelectedLessonParent] = useState<string>('None');
  const [microLessonTitle, setMicroLessonTitle] = useState('');
  const [showNote, setShowNote] = useState<string | null>(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  // Interaction Rule: No background scrolling while dropdown is open
  useEffect(() => {
    if (isDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDropdownOpen]);

  const openAddSheet = () => {
    setUploadFlow('selection');
    setIsAddSheetOpen(true);
  };

  const closeAddSheet = () => {
    setIsAddSheetOpen(false);
    setUploadFlow('selection');
    setSelectedLessonParent('None');
    setMicroLessonTitle('');
    setShowNote(null);
  };

  const handleUploadAndPublish = () => {
    setIsAIProcessing(true);
    // Simulate AI delay
    setTimeout(() => {
      const newUnitId = Math.random().toString(36).substr(2, 9);
      const newUnit: Unit = {
        id: newUnitId,
        title: microLessonTitle || `AI Generated Unit ${units.length + 1}`,
        lessons: [
          { id: 'ml1', title: 'Conceptual Basics' },
          { id: 'ml2', title: 'Advanced Theory' }
        ]
      };
      setUnits([...units, newUnit]);
      setIsAIProcessing(false);
      closeAddSheet();
    }, 2000);
  };

  const deleteBook = () => {
    setUnits([]);
    setDeleteDialog(false);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-[#eff6ff]">
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f0f7ff] h-32 shadow-lg flex items-center px-6 justify-between">
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
            <h1 className="text-xl font-black uppercase leading-tight tracking-tight">Subject Syllabus</h1>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-0.5">{className} • {subjectName}</p>
          </div>
        </div>
        
        <button 
          onClick={openAddSheet}
          className="px-5 py-3 bg-[#2563eb] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          Add Content
        </button>
      </header>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-6 pt-40 pb-24 relative z-10">
        {units.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-[#f0f7ff]/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center text-white border border-white/30 shadow-xl">
               <span className="text-4xl font-black opacity-80">!</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-[#2563eb] font-black uppercase tracking-widest text-xs">No learning materials published yet.</h3>
              <p className="text-[#2563eb]/70 text-[10px] font-bold uppercase tracking-widest">Start by adding your first resource.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up">
            {units.map((unit) => (
              <div key={unit.id} className="bg-[#f0f7ff]/95 p-6 rounded-[3rem] border border-blue-50 shadow-xl space-y-6">
                {/* Unit Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Unit</span>
                    <h3 className="text-lg font-black text-slate-800 leading-tight truncate max-w-[180px]">{unit.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 active:scale-90 transition-all"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                    <button onClick={() => setUnits(units.filter(u => u.id !== unit.id))} className="p-2 text-slate-300 hover:text-red-500 active:scale-90 transition-all"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="space-y-3">
                  {unit.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-blue-50/50 rounded-3xl border border-blue-100 group active:border-blue-200 transition-all">
                      <div className="flex items-center space-x-3">
                         <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                         <p className="text-xs font-bold text-slate-600 truncate max-w-[160px]">{lesson.title}</p>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-500"><svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-500"><svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></button>
                        <button className="p-1.5 text-slate-300 hover:text-red-500"><svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-blue-200 rounded-3xl text-[9px] font-black uppercase text-blue-400 hover:border-blue-300 hover:bg-blue-50 transition-all">+ Add Micro-lesson</button>
                </div>
              </div>
            ))}
            
            <div className="pt-10 flex flex-col items-center space-y-6">
              <button className="w-full py-5 bg-[#f0f7ff] border-2 border-[#2563eb] text-[#2563eb] rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all">+ Add Unit</button>
              <button onClick={() => setDeleteDialog(true)} className="p-4 bg-red-50 text-red-500 rounded-2xl active:bg-red-100 active:scale-90 transition-all shadow-sm">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD CONTENT BOTTOM SHEET */}
      {isAddSheetOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={closeAddSheet} />
          <div className="relative w-full max-h-[90%] bg-[#f0f7ff] rounded-t-[3.5rem] shadow-2xl animate-slide-up flex flex-col overflow-hidden">
            <div className="w-full flex justify-center pt-5 pb-2 shrink-0"><div className="w-14 h-1.5 bg-slate-100 rounded-full" /></div>
            
            <div className="flex-1 overflow-y-auto px-8 py-6 pb-12">
              {isAIProcessing ? (
                <div className="py-24 flex flex-col items-center text-center space-y-8 animate-pulse">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 uppercase">AI Processing</h3>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Structuring your syllabus materials...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-[#2563eb] uppercase tracking-tight">Add Content</h3>
                    <button onClick={closeAddSheet} className="text-slate-400"><svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                  </div>

                  {uploadFlow === 'selection' && (
                    <div className="space-y-4">
                      <button 
                        onClick={() => setUploadFlow('ebook')}
                        className="w-full p-6 bg-[#f0f7ff] border-2 border-[#2563eb] rounded-[2.5rem] flex items-center space-x-6 text-left active:bg-[#2563eb] active:border-white transition-all group"
                      >
                        <div className="w-14 h-14 bg-blue-50 rounded-3xl flex items-center justify-center text-3xl group-active:scale-90 transition-transform">📚</div>
                        <div className="flex-1">
                          <h4 className="font-black text-[#2563eb] group-active:text-white text-base uppercase">E-Book (Full Chapter Set)</h4>
                          <p className="text-[10px] font-bold text-slate-400 group-active:text-white/70 mt-1 uppercase tracking-tight">AI will process this to suggest Units and Micro-lessons.</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => setUploadFlow('notes_step1')}
                        className="w-full p-6 bg-[#f0f7ff] border-2 border-[#2563eb] rounded-[2.5rem] flex items-center space-x-6 text-left active:bg-[#2563eb] active:border-white transition-all group"
                      >
                        <div className="w-14 h-14 bg-indigo-50 rounded-3xl flex items-center justify-center text-3xl group-active:scale-90 transition-transform">📝</div>
                        <div className="flex-1">
                          <h4 className="font-black text-[#2563eb] group-active:text-white text-base uppercase">Single Chapter Notes</h4>
                          <p className="text-[10px] font-bold text-slate-400 group-active:text-white/70 mt-1 uppercase tracking-tight">Upload focused material for a specific topic or concept.</p>
                        </div>
                      </button>
                    </div>
                  )}

                  {uploadFlow === 'ebook' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="space-y-1">
                         <h4 className="text-sm font-black text-[#2563eb] uppercase tracking-widest text-center">PDF/DOC Upload Required</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase text-center">Select your master resource file</p>
                      </div>
                      
                      <div className="w-full aspect-video bg-blue-50 border-2 border-dashed border-[#2563eb]/30 rounded-[3rem] flex flex-col items-center justify-center text-[#2563eb] space-y-3 hover:bg-blue-100/50 transition-all cursor-pointer">
                        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Click to browse or drop file</span>
                      </div>

                      <button 
                        onClick={handleUploadAndPublish}
                        className="w-full py-5 bg-[#2563eb] text-white rounded-[2.25rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                      >
                        Upload & Publish
                      </button>
                    </div>
                  )}

                  {uploadFlow === 'notes_step1' && (
                    <div className="space-y-8 animate-fade-in py-4">
                      <h4 className="text-base font-black text-[#2563eb] uppercase leading-tight text-center px-6">Does this PDF contain more than one unit?</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setUploadFlow('notes_step2')}
                          className="py-8 bg-[#f0f7ff] border-2 border-[#2563eb] rounded-[2.5rem] font-black text-[#2563eb] text-sm uppercase active:bg-[#2563eb] active:text-white transition-all shadow-sm"
                        >
                          No
                        </button>
                        <button 
                          onClick={() => setShowNote('Please upload this using E-Book (Full Chapter Set).')}
                          className={`py-8 bg-[#f0f7ff] border-2 border-[#2563eb] rounded-[2.5rem] font-black text-[#2563eb] text-sm uppercase active:bg-[#2563eb] active:text-white transition-all shadow-sm ${showNote ? 'ring-4 ring-blue-500/10 border-blue-600' : ''}`}
                        >
                          Yes
                        </button>
                      </div>
                      {showNote && (
                        <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex items-start space-x-3 animate-slide-down">
                          <div className="w-5 h-5 bg-[#2563eb] rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0">i</div>
                          <p className="text-[11px] font-bold text-[#2563eb] uppercase tracking-wide leading-relaxed">{showNote}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {uploadFlow === 'notes_step2' && (
                    <div className="space-y-8 animate-fade-in">
                      <h4 className="text-base font-black text-[#2563eb] uppercase text-center">Which lesson does this belong to?</h4>
                      
                      <div className="relative isolate">
                        <button 
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full p-5 bg-blue-50/50 border-2 border-blue-100 rounded-[2rem] flex items-center justify-between font-black text-slate-700 active:border-[#2563eb] transition-all"
                        >
                          <span>{selectedLessonParent}</span>
                          <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
                        </button>

                        {isDropdownOpen && (
                          <>
                            {/* Interaction Rule: Full-screen invisible backdrop to block interaction and close on outside click */}
                            <div className="fixed inset-0 z-[120] bg-transparent pointer-events-auto" onClick={() => setIsDropdownOpen(false)} />
                            {/* Implementation Rule: 100% Solid white dropdown sitting above UI */}
                            <div className="absolute left-0 right-0 mt-3 bg-[#f0f7ff] border-2 border-blue-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.25)] z-[130] overflow-hidden isolate pointer-events-auto !opacity-100">
                              <div className="bg-[#f0f7ff] !opacity-100">
                                {['None', ...units.map(u => u.title)].map(opt => (
                                  <button 
                                    key={opt}
                                    onClick={() => { setSelectedLessonParent(opt); setIsDropdownOpen(false); }}
                                    className="w-full p-5 text-left font-black text-slate-700 hover:bg-blue-50 hover:text-[#2563eb] transition-colors border-b last:border-0 border-blue-50 uppercase text-[11px] tracking-widest bg-[#f0f7ff] !opacity-100"
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {selectedLessonParent === 'None' && (
                        <div className="space-y-2 animate-fade-in">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-5">Micro-lesson title (Optional)</label>
                          <input 
                            type="text" 
                            value={microLessonTitle}
                            onChange={(e) => setMicroLessonTitle(e.target.value)}
                            placeholder="e.g. Fundamental Theorem"
                            className="w-full p-5 bg-blue-50/50 border-2 border-blue-100 rounded-[2rem] outline-none focus:border-[#2563eb] transition-all font-black text-slate-800 placeholder:text-slate-300"
                          />
                        </div>
                      )}

                      <button 
                        onClick={() => setUploadFlow('notes_step3')}
                        className="w-full py-5 bg-[#2563eb] text-white rounded-[2.25rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                      >
                        Next Step
                      </button>
                    </div>
                  )}

                  {uploadFlow === 'notes_step3' && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="w-full aspect-square max-h-[180px] bg-blue-50 border-2 border-dashed border-[#2563eb]/30 rounded-[3rem] flex flex-col items-center justify-center text-[#2563eb] space-y-3 mx-auto">
                        <svg viewBox="0 0 24 24" className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Select Notes File</span>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Split into micro-lessons?</h4>
                        <div className="grid grid-cols-2 gap-3">
                           <button className="py-4 rounded-2xl border-2 border-slate-100 font-black text-xs uppercase text-slate-500 active:bg-slate-50 transition-all">No</button>
                           <button className="py-4 rounded-2xl border-2 border-[#2563eb] font-black text-xs uppercase text-[#2563eb] active:bg-[#2563eb] active:text-white transition-all">Yes, Auto-Split</button>
                        </div>
                      </div>

                      <button 
                        onClick={handleUploadAndPublish}
                        className="w-full py-5 bg-[#2563eb] text-white rounded-[2.25rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                      >
                        Upload & Publish
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteDialog(false)} />
          <div className="relative w-full max-w-sm bg-[#f0f7ff] rounded-[3.5rem] p-10 text-center space-y-8 shadow-2xl animate-slide-up">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-4xl font-black shadow-inner">!</div>
            <h4 className="text-xl font-black text-slate-900 uppercase leading-tight tracking-tight">Are you sure you want to delete the entire book content?</h4>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={deleteBook}
                className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Delete
              </button>
              <button 
                onClick={() => setDeleteDialog(false)}
                className="w-full py-5 bg-[#f0f7ff] border-2 border-blue-100 text-slate-400 rounded-[2rem] font-black uppercase text-xs tracking-widest active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectSyllabusScreen;
