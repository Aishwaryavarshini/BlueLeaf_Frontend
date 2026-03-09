
import React, { useState } from 'react';
import { UserPreferences } from '../App';
import DashboardHeader from '../components/DashboardHeader';
import ProfilePanel from '../components/ProfilePanel';

const SUBJECTS_DATA = [
  { 
    name: 'Mathematics', 
    image: 'https://image2url.com/r2/default/images/1772465211647-6f6cfc85-19b7-4c7a-b4cc-002115110607.jpeg',
    color: 'from-blue-50 to-white'
  },
  { 
    name: 'Science', 
    image: 'https://image2url.com/r2/default/images/1772465272456-b35e32af-a17a-4443-ac6d-c636bf4525b0.jpeg',
    color: 'from-blue-50 to-white'
  },
  { 
    name: 'Tamil', 
    image: 'https://image2url.com/r2/default/images/1772465324035-b96d7663-6853-4ea9-aef0-dc5689c7ec72.jpeg',
    color: 'from-blue-50 to-white'
  },
  { 
    name: 'English', 
    image: 'https://image2url.com/r2/default/images/1772465249026-ebd63f60-0864-420b-822a-c1df65f95025.jpeg',
    color: 'from-blue-50 to-white'
  },
  { 
    name: 'Social Science', 
    image: 'https://image2url.com/r2/default/images/1772465301227-2f757c22-504e-4b10-8ad7-30e2ae17c4dd.jpeg',
    color: 'from-blue-50 to-white'
  }
];

interface StudentNote {
  id: string;
  title: string;
  subject: string;
  unit: string;
  date: string;
  autoSplit: boolean;
  scope: 'unit' | 'lesson' | 'none';
}

interface StudentDashboardProps {
  preferences: UserPreferences;
  onSelectSubject: (subject: string) => void;
  onResumeLesson: (subject: string, unit: string, lesson: string) => void;
  onTriggerUpload: () => void;
  onUpdateVoice: (voice: string) => void;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onLogout: () => void;
}

const SubjectBurst: React.FC = () => {
  // A subtle radial burst using simple dots/leaves
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    tx: `${Math.cos((i * 30) * (Math.PI / 180)) * 120}px`,
    ty: `${Math.sin((i * 30) * (Math.PI / 180)) * 120}px`,
    delay: `${Math.random() * 0.05}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-[100] flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 bg-blue-400 rounded-full animate-[subtle-pop_0.6s_ease-out_forwards] opacity-0"
          style={{
            '--tx': p.tx,
            '--ty': p.ty,
            animationDelay: p.delay
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  preferences, 
  onSelectSubject, 
  onResumeLesson,
  onTriggerUpload,
  onUpdateVoice,
  onUpdatePreferences,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'notes'>('main');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [animatingSubject, setAnimatingSubject] = useState<string | null>(null);

  // Notes state
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Metadata collection
  const [noteSubject, setNoteSubject] = useState('');
  const [noteUnit, setNoteUnit] = useState('');
  const [noteAutoSplit, setNoteAutoSplit] = useState<boolean | null>(null);
  const [noteScope, setNoteScope] = useState<'unit' | 'lesson' | 'none'>('none');
  
  const [dropdownSubjectOpen, setDropdownSubjectOpen] = useState(false);
  const [dropdownUnitOpen, setDropdownUnitOpen] = useState(false);

  const handleSubjectClick = (subjectName: string) => {
    if (animatingSubject) return;
    setAnimatingSubject(subjectName);
    
    // Short delay for the subtle animation to be visible before navigation
    setTimeout(() => {
      onSelectSubject(subjectName);
      setAnimatingSubject(null);
    }, 400);
  };

  const resetUpload = () => {
    setIsUploadModalOpen(false);
    setUploadStep(1);
    setSelectedFile(null);
    setNoteSubject('');
    setNoteUnit('');
    setNoteAutoSplit(null);
    setNoteScope('none');
  };

  const handlePublish = () => {
    const newNote: StudentNote = {
      id: Math.random().toString(36).substr(2, 9),
      title: selectedFile?.name || 'Untitled Note',
      subject: noteSubject,
      unit: noteUnit || 'None',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      autoSplit: !!noteAutoSplit,
      scope: noteScope
    };
    setNotes(prev => [newNote, ...prev]);
    resetUpload();
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const mainTabLabel = preferences.belongsToInstitute ? 'Subjects' : 'Your Learning';

  return (
    <div className="h-full flex flex-col relative animate-fade-in overflow-hidden">
      <style>{`
        @keyframes subtle-pop {
          0% { transform: scale(0.2); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
        }
        .perspective-card {
          perspective: 1000px;
        }
      `}</style>

      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />

      <DashboardHeader 
        preferences={preferences} 
        title="Dashboard" 
        onProfileClick={() => setIsProfileOpen(true)}
      />

      <ProfilePanel 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        preferences={preferences}
        onResume={(s, u, l) => {
          setIsProfileOpen(false);
          onResumeLesson(s, u, l);
        }}
        onUpdateVoice={onUpdateVoice}
        onUpdatePreferences={onUpdatePreferences}
        onLogout={onLogout}
      />

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 mt-6">
          <div className="flex bg-white/20 backdrop-blur-md p-1 rounded-2xl border border-white/30">
            <button
              onClick={() => setActiveTab('main')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] ${
                activeTab === 'main' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-white'
              }`}
            >
              {mainTabLabel}
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] ${
                activeTab === 'notes' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-white'
              }`}
            >
              My Notes
            </button>
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'main' ? (
            preferences.belongsToInstitute ? (
              /* CASE 2: Institute Student - Subjects Carousel */
              <div className="space-y-6">
                <div className="px-6">
                   <h2 className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] drop-shadow-sm">Select Your Subject</h2>
                </div>
                
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-12 no-scrollbar">
                  {SUBJECTS_DATA.map((subject) => (
                    <button
                      key={subject.name}
                      onClick={() => handleSubjectClick(subject.name)}
                      className="flex-shrink-0 w-[260px] aspect-[4/5] bg-gradient-to-br from-white to-blue-50 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-end snap-center border-4 border-white transition-all active:scale-[0.97] group"
                    >
                      {/* Mascot Image Background - Layered Behind */}
                      <div className="absolute inset-x-0 top-0 h-[85%] flex items-center justify-center p-8 pb-20 pointer-events-none transition-transform group-active:scale-105">
                        <img 
                          src={subject.image} 
                          alt={subject.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback if images aren't reachable, using a generic leaf icon
                            (e.target as HTMLImageElement).src = 'https://i.postimg.cc/13qKn62Y/file-000000007550720b9d8fcbcca1006fbe.png';
                          }}
                        />
                      </div>

                      {/* Foreground Button - Partially Overlapping */}
                      <div className="relative z-10 w-full p-6 pt-0">
                        <div className="w-full py-5 bg-white rounded-[2rem] shadow-xl border border-blue-50 flex items-center justify-center group-active:bg-blue-50 transition-colors">
                          <span className="font-black text-[#2563eb] text-sm uppercase tracking-[0.15em] leading-none">
                            {subject.name}
                          </span>
                        </div>
                      </div>

                      {/* Interaction Visual Cue */}
                      {animatingSubject === subject.name && <SubjectBurst />}
                    </button>
                  ))}
                  {/* Spacer for horizontal scroll */}
                  <div className="flex-shrink-0 w-6" />
                </div>
              </div>
            ) : (
              /* CASE 1: Independent Student - Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-slide-up px-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m8 17 4 4 4-4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">Upload notes to get started</h3>
                  <p className="text-white/80 leading-relaxed max-w-[240px] mx-auto font-medium">Upload your study materials and let AI create lessons for you</p>
                </div>
                <button onClick={() => setActiveTab('notes')} className="px-10 py-4 bg-white border-2 border-[#2563eb] text-[#2563eb] font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl active:scale-[0.98] active:bg-blue-50 transition-all">Go to Notes</button>
              </div>
            )
          ) : (
            /* My Notes Tab Content */
            <div className="flex flex-col animate-fade-in space-y-6 px-6">
              {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-[2rem] flex items-center justify-center mb-2 border border-white/20">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                  </div>
                  <p className="text-white font-medium">No notes uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4 animate-slide-up">
                  {notes.map(note => (
                    <div key={note.id} className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-[#2563eb]/10 flex items-center justify-between group">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">{note.subject}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{note.date}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg truncate max-w-[180px]">{note.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{note.unit !== 'None' ? `Unit: ${note.unit}` : 'Personal Note'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-3 bg-slate-50 text-[#2563eb] rounded-2xl active:bg-blue-100 transition-all"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></button>
                        <button onClick={() => deleteNote(note.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl active:bg-red-100 transition-all"><svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="sticky bottom-0 pb-4">
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full bg-white border-2 border-[#2563eb] border-dashed p-8 rounded-[3rem] flex flex-col items-center justify-center space-y-3 active:scale-[0.98] active:bg-blue-50 active:border-solid transition-all group shadow-xl"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-[#2563eb]/10">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </div>
                  <span className="font-black text-[#2563eb] uppercase tracking-widest text-xs">Upload File</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">PDF or Scanned Images</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NOTES UPLOAD MODAL - STEPPED INTERACTION */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={resetUpload} />
          <div className="relative w-full h-[90%] bg-white rounded-t-[4rem] shadow-2xl animate-slide-up flex flex-col overflow-hidden">
            <div className="w-full flex justify-center pt-5 pb-2 shrink-0"><div className="w-14 h-1.5 bg-slate-100 rounded-full" /></div>
            
            <div className="flex-1 overflow-y-auto px-10 pt-6 pb-20 space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-[#2563eb] uppercase tracking-tight">Upload Notes</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {uploadStep} of 5</p>
                </div>
                <button onClick={resetUpload} className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
              </div>

              {/* STEP 1: FILE PICKER */}
              {uploadStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="w-full aspect-video bg-blue-50 border-2 border-dashed border-[#2563eb]/20 rounded-[3rem] flex flex-col items-center justify-center space-y-4 relative overflow-hidden group active:bg-blue-100 transition-all">
                    <input 
                      type="file" 
                      accept=".pdf,image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) { setSelectedFile(file); setUploadStep(2); }
                      }}
                    />
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-blue-100">
                      <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    </div>
                    <div className="text-center">
                      <p className="font-black text-[#2563eb] text-xs uppercase tracking-widest">Choose Note File</p>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tight mt-1">PDF, JPG or PNG</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: AI HANDLING */}
              {uploadStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-1">
                    <h4 className="text-[#2563eb] font-black uppercase tracking-tight text-lg">AI Handling</h4>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">How should Blue process this file?</p>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={() => { setNoteAutoSplit(true); setUploadStep(3); }}
                      className="w-full p-6 bg-white border-2 border-[#2563eb] rounded-[2.5rem] text-left group active:bg-blue-600 transition-all shadow-md"
                    >
                      <h5 className="font-black text-[#2563eb] group-active:text-white uppercase tracking-tight">Auto-split into micro-lessons</h5>
                      <p className="text-slate-400 group-active:text-white/70 text-[10px] font-bold uppercase tracking-tighter mt-1">AI segments content into manageable topics</p>
                    </button>
                    <button 
                      onClick={() => { setNoteAutoSplit(false); setUploadStep(3); }}
                      className="w-full p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] text-left group active:border-[#2563eb] transition-all shadow-sm"
                    >
                      <h5 className="font-black text-slate-800 uppercase tracking-tight">Keep as single note</h5>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter mt-1">Store exactly as uploaded, no splitting</p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SUBJECT SELECTION */}
              {uploadStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-1">
                    <h4 className="text-[#2563eb] font-black uppercase tracking-tight text-lg">Select Subject</h4>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Which subject is this for?</p>
                  </div>
                  <div className="relative isolate">
                    <button 
                      onClick={() => setDropdownSubjectOpen(!dropdownSubjectOpen)}
                      className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex items-center justify-between font-black text-slate-800 active:border-[#2563eb] transition-all"
                    >
                      <span>{noteSubject || 'Select Subject'}</span>
                      <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform ${dropdownSubjectOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    {dropdownSubjectOpen && (
                      <>
                        <div className="fixed inset-0 z-[120] bg-transparent" onClick={() => setDropdownSubjectOpen(false)} />
                        <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-slate-100 rounded-[2rem] shadow-2xl z-[130] overflow-hidden !opacity-100">
                          {['Mathematics', 'Science', 'Tamil', 'English', 'Social Science'].map(s => (
                            <button 
                              key={s} 
                              onClick={() => { setNoteSubject(s); setDropdownSubjectOpen(false); setUploadStep(4); }}
                              className="w-full p-5 text-left font-black text-slate-700 hover:bg-blue-50 border-b border-slate-50 last:border-0 uppercase text-[11px] tracking-widest"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: UNIT SELECTION */}
              {uploadStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-1">
                    <h4 className="text-[#2563eb] font-black uppercase tracking-tight text-lg">Map to Unit</h4>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Where should this go?</p>
                  </div>
                  <div className="relative isolate">
                    <button 
                      onClick={() => setDropdownUnitOpen(!dropdownUnitOpen)}
                      className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex items-center justify-between font-black text-slate-800 active:border-[#2563eb] transition-all"
                    >
                      <span>{noteUnit || 'Select Unit'}</span>
                      <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform ${dropdownUnitOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    {dropdownUnitOpen && (
                      <>
                        <div className="fixed inset-0 z-[120] bg-transparent" onClick={() => setDropdownUnitOpen(false)} />
                        <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-slate-100 rounded-[2rem] shadow-2xl z-[130] overflow-hidden !opacity-100">
                          {['None / Personal Note', 'Algebra', 'Geometry', 'Motion', 'Measurements'].map(u => (
                            <button 
                              key={u} 
                              onClick={() => { setNoteUnit(u); setDropdownUnitOpen(false); setUploadStep(noteAutoSplit ? 5 : 6); }}
                              className="w-full p-5 text-left font-black text-slate-700 hover:bg-blue-50 border-b border-slate-50 last:border-0 uppercase text-[11px] tracking-widest"
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: SCOPE (AUTO-SPLIT ONLY) */}
              {uploadStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                   <div className="text-center space-y-1">
                    <h4 className="text-[#2563eb] font-black uppercase tracking-tight text-lg">Content Scope</h4>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Help AI segment better</p>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={() => { setNoteScope('unit'); setUploadStep(6); }}
                      className="w-full p-6 bg-white border-2 border-[#2563eb] rounded-[2.5rem] text-left group active:bg-blue-600 shadow-md"
                    >
                      <h5 className="font-black text-[#2563eb] group-active:text-white uppercase tracking-tight">Full Unit Content</h5>
                      <p className="text-slate-400 group-active:text-white/70 text-[10px] font-bold uppercase tracking-tighter mt-1">May suggest multiple new micro-lessons</p>
                    </button>
                    <button 
                      onClick={() => { setNoteScope('lesson'); setUploadStep(6); }}
                      className="w-full p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] text-left group active:border-[#2563eb] shadow-sm"
                    >
                      <h5 className="font-black text-slate-800 uppercase tracking-tight">Single Lesson Only</h5>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter mt-1">AI stays focused on this topic</p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: PUBLISH */}
              {uploadStep === 6 && (
                 <div className="space-y-8 animate-fade-in">
                  <div className="bg-slate-50 p-8 rounded-[3.5rem] border-2 border-blue-100/50 space-y-6 shadow-inner text-center">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Ready to Publish</h4>
                    <p className="text-lg font-bold text-slate-800 truncate px-4">{selectedFile?.name}</p>
                    <div className="flex justify-center space-x-2">
                       <span className="text-[9px] font-black text-[#2563eb] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{noteSubject}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handlePublish}
                    className="w-full py-6 bg-[#2563eb] text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all"
                  >
                    Publish Note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
