
import React, { useState } from 'react';
import { UserPreferences } from '../App';

interface FacultyCurriculumManagementScreenProps {
  preferences: UserPreferences;
  subjectName: string;
  className: string;
  onBack: () => void;
}

interface Lesson {
  id: string;
  title: string;
}

interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
  status: 'draft' | 'published';
  isExpanded?: boolean;
}

const FacultyCurriculumManagementScreen: React.FC<FacultyCurriculumManagementScreenProps> = ({
  preferences,
  subjectName,
  className,
  onBack
}) => {
  // Mocking already published content
  const [units, setUnits] = useState<Unit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Upload Flow State
  const [uploadStep, setUploadStep] = useState<'selection' | 'notes_questions' | 'upload_area'>('selection');
  const [uploadType, setUploadType] = useState<'ebook' | 'notes' | null>(null);
  
  // Notes Flow Specific State
  const [hasMultipleUnits, setHasMultipleUnits] = useState<boolean | null>(null);
  const [selectedParentUnit, setSelectedParentUnit] = useState<string>('None');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [microLessonTitle, setMicroLessonTitle] = useState('');
  const [isStaging, setIsStaging] = useState(false);

  const handleOpenAdd = () => {
    setShowAddModal(true);
    setUploadStep('selection');
    setUploadType(null);
    setHasMultipleUnits(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setUploadStep('selection');
    setHasMultipleUnits(null);
    setSelectedParentUnit('None');
    setMicroLessonTitle('');
  };

  const handleNotesFlow = (multiple: boolean) => {
    setHasMultipleUnits(multiple);
    if (!multiple) {
      setUploadStep('notes_questions');
    }
  };

  const handleStageContent = () => {
    setIsStaging(true);
    // Simulate AI suggestion/processing
    setTimeout(() => {
      const newUnitId = Math.random().toString(36).substr(2, 9);
      const newUnit: Unit = {
        id: newUnitId,
        title: microLessonTitle || "New Unit",
        lessons: [
          { id: 'l1', title: 'Conceptual Introduction' },
          { id: 'l2', title: 'Core Theory' },
          { id: 'l3', title: 'Interactive Practice' }
        ],
        status: 'draft',
        isExpanded: true
      };
      setUnits([...units, newUnit]);
      setIsStaging(false);
      handleCloseModal();
    }, 1800);
  };

  const handleDeleteUnit = (id: string) => {
    setUnits(units.filter(u => u.id !== id));
  };

  const handlePublish = (id: string) => {
    setUnits(units.map(u => u.id === id ? { ...u, status: 'published' } : u));
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-white">
      {/* GLOBAL STATIC BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white h-32 shadow-lg flex items-center px-6">
        <button 
          onClick={onBack}
          className="p-3 bg-transparent text-[#2563eb] rounded-2xl shadow-lg border-2 border-[#2563eb]/20 active:scale-95 active:bg-[#2563eb]/10 transition-all active:border-[#2563eb] mr-4"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex flex-col text-[#2563eb]">
          <h1 className="text-xl font-black uppercase leading-tight">{subjectName}</h1>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-0.5">{className} • Curriculum Management</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-40 pb-24 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-md">Curriculum Units</h2>
          <button 
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-white text-[#2563eb] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            + Add Unit/Lesson
          </button>
        </div>

        {units.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center text-white/50">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            </div>
            <p className="text-white font-bold uppercase tracking-widest text-xs">No curriculum units staged yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {units.map(unit => (
              <div key={unit.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-md overflow-hidden animate-slide-up">
                <div 
                  onClick={() => setUnits(units.map(u => u.id === unit.id ? { ...u, isExpanded: !u.isExpanded } : u))}
                  className="p-6 flex justify-between items-start cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight">{unit.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${unit.status === 'published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {unit.status}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{unit.lessons.length} Lessons</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteUnit(unit.id); }} 
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg active:scale-90 transition-all"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                    {unit.status === 'draft' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePublish(unit.id); }} 
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                      >
                        Publish
                      </button>
                    )}
                    <svg viewBox="0 0 24 24" className={`w-5 h-5 text-slate-400 transition-transform ${unit.isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                </div>

                {unit.isExpanded && (
                  <div className="px-6 pb-6 space-y-3 animate-fade-in border-t border-slate-50 pt-4">
                    {unit.lessons.map((lesson, lIdx) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[10px] font-black text-blue-600 shadow-sm">
                            {lIdx + 1}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{lesson.title}</span>
                        </div>
                        <button className="px-3 py-1.5 bg-white text-blue-600 rounded-xl text-[8px] font-black uppercase tracking-widest border border-blue-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity active:scale-95">
                          Preview
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-900 uppercase">Stage Content</h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {isStaging ? (
                <div className="py-20 flex flex-col items-center text-center space-y-6">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-black text-slate-600 uppercase tracking-widest">AI is structuring your content...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {uploadStep === 'selection' && (
                    <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => { setUploadType('notes'); setUploadStep('upload_area'); }}
                        className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex flex-col items-start active:border-blue-600 transition-all text-left"
                      >
                        <span className="text-2xl mb-2">📝</span>
                        <h4 className="font-black text-slate-800">Upload Handwritten Notes</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI creates lessons from scans</p>
                      </button>
                      <button 
                        onClick={() => { setUploadType('ebook'); setUploadStep('upload_area'); }}
                        className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex flex-col items-start active:border-blue-600 transition-all text-left"
                      >
                        <span className="text-2xl mb-2">📚</span>
                        <h4 className="font-black text-slate-800">Import Textbook PDF</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Auto-segment into micro-lessons</p>
                      </button>
                    </div>
                  )}

                  {uploadStep === 'upload_area' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Content Title</label>
                        <input 
                          type="text" 
                          value={microLessonTitle}
                          onChange={(e) => setMicroLessonTitle(e.target.value)}
                          placeholder="e.g., Intro to Polynomials"
                          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-blue-600 outline-none"
                        />
                      </div>
                      <div className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                        <span className="text-[10px] font-black uppercase">Click to browse or drop file</span>
                      </div>
                      <div className="flex space-x-3 pt-4">
                        <button onClick={() => setUploadStep('selection')} className="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
                        <button 
                          onClick={handleStageContent}
                          disabled={!microLessonTitle}
                          className="flex-[2] py-4 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-lg disabled:opacity-50"
                        >
                          Stage with AI
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyCurriculumManagementScreen;
