
import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../App';

interface AddStaffScreenProps {
  preferences: UserPreferences;
  onBack: () => void;
  onSuccess: () => void;
}

const TEACHING_LEVELS = ['Primary', 'Secondary', 'Higher Secondary'];
const PRIMARY_SUBJECTS = ['Tamil', 'English', 'Mathematics', 'Social', 'Environmental Science (EVS)'];
const SECONDARY_SUBJECTS = ['Tamil', 'English', 'Mathematics', 'Social Science', 'Science'];
const HS_GROUPS = {
  'Commerce': ['Accountancy', 'Economics', 'Commerce', 'Business Maths'],
  'Bio-Maths': ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
  'Computer Science': ['Physics', 'Chemistry', 'Computer Science', 'Mathematics'],
  'Pure Science': ['Physics', 'Chemistry', 'Biology', 'Botany', 'Zoology']
};

const AddStaffScreen: React.FC<AddStaffScreenProps> = ({ preferences, onBack, onSuccess }) => {
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [teachingLevel, setTeachingLevel] = useState('');
  const [hsGroup, setHsGroup] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [assignedClass, setAssignedClass] = useState<string>('');

  const [levelDropdown, setLevelDropdown] = useState(false);
  const [groupDropdown, setGroupDropdown] = useState(false);
  const [subjectDropdown, setSubjectDropdown] = useState(false);
  const [classDropdown, setClassDropdown] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const assignedClassList = [3, 9, 10]; // Mock occupied classes

  const getSubjects = () => {
    if (teachingLevel === 'Primary') return PRIMARY_SUBJECTS;
    if (teachingLevel === 'Secondary') return SECONDARY_SUBJECTS;
    if (teachingLevel === 'Higher Secondary' && hsGroup) return HS_GROUPS[hsGroup as keyof typeof HS_GROUPS] || [];
    return [];
  };

  const handleConfirm = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onSuccess();
    }, 2000);
  };

  const closeAllDropdowns = () => {
    setLevelDropdown(false);
    setGroupDropdown(false);
    setSubjectDropdown(false);
    setClassDropdown(false);
  };

  const DropdownBackdrop = ({ active }: { active: boolean }) => active ? (
    <div className="fixed inset-0 z-[110] bg-transparent" onClick={closeAllDropdowns} />
  ) : null;

  return (
    <div className="h-full flex flex-col bg-white relative animate-fade-in overflow-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center px-6 h-32 border-b border-slate-100">
        <button 
          onClick={onBack} 
          className="p-3 -ml-2 text-[#2563eb] active:scale-95 transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex flex-col text-[#2563eb] ml-2">
          <h1 className="text-xl font-black uppercase tracking-tight">Add New Staff</h1>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Register Teaching Faculty</p>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 pt-40 pb-32 space-y-8">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
          <input 
            type="text" 
            value={staffName} 
            onChange={(e) => setStaffName(e.target.value)}
            placeholder="e.g. Senthil Kumar" 
            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#2563eb] font-bold text-slate-800 transition-all"
          />
        </div>

        {/* Email ID */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
          <input 
            type="email" 
            value={staffEmail} 
            onChange={(e) => setStaffEmail(e.target.value)}
            placeholder="email@tn-school.edu" 
            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#2563eb] font-bold text-slate-800 transition-all"
          />
        </div>

        {/* Temporary Password */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Temporary Password</label>
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              value={staffPass} 
              onChange={(e) => setStaffPass(e.target.value)}
              placeholder="••••••••" 
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#2563eb] font-bold text-slate-800 transition-all"
            />
            <button 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"
            >
              {showPass ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Teaching Level Dropdown */}
        <div className="space-y-2 relative isolate">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teaching Level</label>
          <button 
            onClick={() => setLevelDropdown(!levelDropdown)}
            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-between font-bold text-slate-700 active:border-[#2563eb] transition-all"
          >
            <span>{teachingLevel || 'Select Level'}</span>
            <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform ${levelDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <DropdownBackdrop active={levelDropdown} />
          {levelDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-white !opacity-100 border-2 border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[120] overflow-hidden animate-slide-up">
              <div className="bg-white !opacity-100 divide-y divide-slate-50">
                {TEACHING_LEVELS.map(lvl => (
                  <button 
                    key={lvl} 
                    onClick={() => { setTeachingLevel(lvl); setLevelDropdown(false); setSelectedSubjects([]); setHsGroup(''); }}
                    className="w-full p-5 text-left font-bold text-slate-700 hover:bg-blue-50 transition-colors uppercase text-[11px] tracking-widest"
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Higher Secondary Group Dropdown */}
        {teachingLevel === 'Higher Secondary' && (
          <div className="space-y-2 relative isolate animate-fade-in">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Group</label>
            <button 
              onClick={() => setGroupDropdown(!groupDropdown)}
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-between font-bold text-slate-700 active:border-[#2563eb] transition-all"
            >
              <span>{hsGroup || 'Choose Group'}</span>
              <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform ${groupDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <DropdownBackdrop active={groupDropdown} />
            {groupDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white !opacity-100 border-2 border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[120] overflow-hidden animate-slide-up">
                <div className="bg-white !opacity-100 divide-y divide-slate-50">
                  {Object.keys(HS_GROUPS).map(grp => (
                    <button 
                      key={grp} 
                      onClick={() => { setHsGroup(grp); setGroupDropdown(false); setSelectedSubjects([]); }}
                      className="w-full p-5 text-left font-bold text-slate-700 hover:bg-blue-50 transition-colors uppercase text-[11px] tracking-widest"
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subjects Dropdown */}
        {(teachingLevel && (teachingLevel !== 'Higher Secondary' || hsGroup)) && (
          <div className="space-y-2 relative isolate animate-fade-in">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subjects</label>
            <button 
              onClick={() => setSubjectDropdown(!subjectDropdown)}
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-between font-bold text-slate-700 active:border-[#2563eb] transition-all"
            >
              <span className="truncate pr-4">{selectedSubjects.length > 0 ? selectedSubjects.join(', ') : 'Select Subjects'}</span>
              <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform ${subjectDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <DropdownBackdrop active={subjectDropdown} />
            {subjectDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white !opacity-100 border-2 border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[120] overflow-hidden animate-slide-up">
                <div className="max-h-60 overflow-y-auto bg-white !opacity-100 divide-y divide-slate-50">
                  {getSubjects().map(sub => (
                    <button 
                      key={sub}
                      onClick={() => {
                        setSelectedSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
                      }}
                      className="w-full p-5 text-left font-bold flex items-center justify-between transition-colors uppercase text-[11px] tracking-widest bg-white !opacity-100"
                    >
                      <span className={selectedSubjects.includes(sub) ? 'text-[#2563eb]' : 'text-slate-700'}>{sub}</span>
                      {selectedSubjects.includes(sub) && (
                        <div className="w-5 h-5 bg-[#2563eb] rounded-full flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Class Teacher Role Toggle */}
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
          <div className="flex flex-col">
            <span className="font-black text-slate-800 text-sm uppercase">Class Teacher Role</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Assign primary class responsibility</p>
          </div>
          <button 
            onClick={() => setIsClassTeacher(!isClassTeacher)}
            className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${isClassTeacher ? 'bg-[#2563eb]' : 'bg-slate-200'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isClassTeacher ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Assign Class Dropdown */}
        {isClassTeacher && (
          <div className="space-y-2 relative isolate animate-fade-in">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Class</label>
            <button 
              onClick={() => setClassDropdown(!classDropdown)}
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-between font-bold text-slate-700 active:border-[#2563eb] transition-all"
            >
              <span>{assignedClass || 'Choose Class'}</span>
              <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform ${classDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <DropdownBackdrop active={classDropdown} />
            {classDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white !opacity-100 border-2 border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[120] overflow-hidden animate-slide-up">
                <div className="max-h-60 overflow-y-auto bg-white !opacity-100 divide-y divide-slate-50">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => {
                    const isTaken = assignedClassList.includes(num);
                    return (
                      <button 
                        key={num}
                        disabled={isTaken}
                        onClick={() => { setAssignedClass(`Class ${num}`); setClassDropdown(false); }}
                        className={`w-full p-5 text-left font-bold flex items-center justify-between transition-colors uppercase text-[11px] tracking-widest bg-white !opacity-100 ${isTaken ? 'text-slate-300 bg-slate-50' : 'text-slate-700 hover:bg-blue-50'}`}
                      >
                        <span>Class {num}</span>
                        {isTaken && <span className="text-[8px] opacity-60">Already Assigned</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirm Button */}
        <div className="pt-4">
          <button 
            onClick={handleConfirm}
            disabled={!staffName || !staffEmail || !staffPass || !teachingLevel || selectedSubjects.length === 0}
            className="w-full py-5 bg-[#2563eb] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none"
          >
            Confirm Registration
          </button>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      {showToast && (
        <div className="fixed top-12 left-6 right-6 z-[200] animate-slide-down">
          <div className="bg-[#2563eb] p-5 rounded-2xl shadow-2xl flex items-center space-x-4 border border-white/20">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span className="text-white font-bold text-sm uppercase tracking-tight">Staff member added successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStaffScreen;
