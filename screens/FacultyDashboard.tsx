
import React, { useState, useEffect, useMemo } from 'react';
import { UserPreferences } from '../App';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface FacultyDashboardProps {
  preferences: UserPreferences;
  onLogout: () => void;
  onSelectSubject: (subjectName: string, className: string) => void;
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

interface StudentStats {
  id: string;
  name: string;
  performance: 'Good' | 'Average' | 'Needs Attention';
  attendance: 'High' | 'Moderate' | 'Low';
  struggledTopics: Record<string, string[]>;
  activeLevel: Record<string, 'High' | 'Average' | 'Low'>;
  overallPass: boolean;
}

interface PendingStudent {
  id: string;
  name: string;
  grade: string;
  email: string;
  language: string;
}

const MOCK_STUDENTS: StudentStats[] = [
  { id: '1', name: 'Rajesh K.', performance: 'Average', attendance: 'High', overallPass: true, activeLevel: { 'Mathematics': 'High', 'Science': 'Average' }, struggledTopics: { 'Mathematics': ['Algebraic Identities'], 'Science': ['Fluids'] } },
  { id: '2', name: 'Suresh M.', performance: 'Good', attendance: 'High', overallPass: true, activeLevel: { 'Mathematics': 'High', 'Science': 'High' }, struggledTopics: { 'Mathematics': [], 'Science': [] } },
  { id: '3', name: 'Kavitha R.', performance: 'Needs Attention', attendance: 'Moderate', overallPass: false, activeLevel: { 'Mathematics': 'Low', 'Science': 'Average' }, struggledTopics: { 'Mathematics': ['Trigonometry'], 'Science': ['Heat'] } },
  { id: '4', name: 'Meena S.', performance: 'Good', attendance: 'High', overallPass: true, activeLevel: { 'Mathematics': 'High', 'Science': 'High' }, struggledTopics: { 'Mathematics': [], 'Science': ['Measurements'] } },
  { id: '5', name: 'Arun P.', performance: 'Needs Attention', attendance: 'Low', overallPass: false, activeLevel: { 'Mathematics': 'Low', 'Science': 'Low' }, struggledTopics: { 'Mathematics': ['Equations'], 'Science': ['Motion'] } },
  { id: '6', name: 'Priya D.', performance: 'Average', attendance: 'Moderate', overallPass: true, activeLevel: { 'Mathematics': 'Average', 'Science': 'High' }, struggledTopics: { 'Mathematics': ['Identities'], 'Science': [] } },
];

const INITIAL_PENDING: PendingStudent[] = [
  { id: 'p1', name: 'Vijay Raman', grade: 'Grade 9', email: 'vijay.r@demo.com', language: 'Tamil' },
  { id: 'p2', name: 'Deepika S.', grade: 'Grade 9', email: 'deepi.s@demo.com', language: 'English' }
];

const MASCOT_GRID_URL = 'https://i.postimg.cc/BvB7m9p5/mascot-grid.png';

const ApprovalMascot: React.FC<{ isApproved: boolean }> = ({ isApproved }) => {
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (isApproved) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isApproved]);

  return (
    <div className="relative w-20 h-20 shrink-0">
      {/* Pulse Glow */}
      {isApproved && (
        <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-xl animate-[glow-once_1.5s_ease-out_forwards]" />
      )}

      {/* Sparkles */}
      {showSparkles && (
        <div className="absolute inset-x-0 -top-10 pointer-events-none z-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full animate-[rising-sparkle_1.5s_ease-out_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                opacity: 0
              }}
            />
          ))}
        </div>
      )}

      {/* Mascot Image (Cropped from grid) */}
      <div className={`w-full h-full rounded-2xl overflow-hidden border-2 border-white shadow-sm transition-all duration-700 bg-blue-900/10 ${isApproved ? 'scale-105 shadow-blue-200 ring-4 ring-blue-500/10' : ''}`}>
        <div 
          className="w-[200%] h-[200%] transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${MASCOT_GRID_URL})`,
            backgroundSize: '200% 200%',
            backgroundPosition: isApproved ? '100% 0%' : '100% 100%', // Neutral (BR) to Cheerful (TR)
          }}
        />
      </div>

      <style>{`
        @keyframes glow-once {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes rising-sparkle {
          0% { transform: translateY(20px) scale(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ preferences, onLogout, onSelectSubject }) => {
  const isCT = preferences.role === 'Class Teacher'; 
  const teacherSubjects = preferences.assignedSubject ? [preferences.assignedSubject] : ['Mathematics', 'Science'];

  const [viewMode, setViewMode] = useState<'class' | 'subject'>(isCT ? 'class' : 'subject');
  const [activeSubject, setActiveSubject] = useState<string | null>(preferences.assignedSubject || teacherSubjects[0]);
  const [selectedStudent, setSelectedStudent] = useState<StudentStats | null>(null);
  const [viewingClassStudents, setViewingClassStudents] = useState<string | null>(null);
  const [strugglingClassToggle, setStrugglingClassToggle] = useState<string>('Class 9');
  const [selectedProfileSubject, setSelectedProfileSubject] = useState<string | null>(null);

  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>(INITIAL_PENDING);
  const [approvingStudent, setApprovingStudent] = useState<PendingStudent | null>(null);
  const [rejectingStudent, setRejectingStudent] = useState<PendingStudent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Approval Animation State
  const [animatingApprovalId, setAnimatingApprovalId] = useState<string | null>(null);

  const assignedClasses = ['Class 8', 'Class 9', 'Class 10'];

  const handleBackToDashboard = () => {
    setViewingClassStudents(null);
    setSelectedStudent(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmApproval = () => {
    if (approvingStudent) {
      const studentId = approvingStudent.id;
      setApprovingStudent(null);
      setAnimatingApprovalId(studentId);

      // Animation duration ~2 seconds
      setTimeout(() => {
        setPendingStudents(prev => prev.filter(s => s.id !== studentId));
        setAnimatingApprovalId(null);
        showToast("Student approved successfully");
      }, 2500);
    }
  };

  const handleConfirmRejection = () => {
    if (rejectingStudent) {
      setPendingStudents(prev => prev.filter(s => s.id !== rejectingStudent.id));
      showToast("Student request rejected");
      setRejectingStudent(null);
    }
  };

  const renderPerformanceBadge = (perf: string) => {
    const colors: Record<string, string> = {
      'Good': 'bg-green-50 text-green-600 border-green-100',
      'Average': 'bg-blue-50 text-blue-600 border-blue-100',
      'Needs Attention': 'bg-red-50 text-red-600 border-red-100'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${colors[perf] || colors['Average']}`}>
        {perf}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-white">
      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />

      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-slide-down">
          <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-white/10 flex items-center space-x-3">
            <span className="text-white text-[10px] font-black uppercase tracking-widest">{toastMessage}</span>
          </div>
        </div>
      )}

      <header className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg flex items-center px-6 transition-all ${isCT ? 'h-40' : 'h-32'}`}>
        <div className="flex-1 flex flex-col text-[#2563eb] space-y-0.5">
          <h1 className="text-xl font-black uppercase truncate max-w-[240px]">
            {preferences.instituteName || "BlueLeaf Academy"}
          </h1>
          <p className="text-sm font-bold">{preferences.username}</p>
          <div className="flex flex-col">
            {isCT ? (
              <>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  Class Teacher – Grade {preferences.selectedClass || 9}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  {teacherSubjects.map(sub => (
                    <button
                      key={sub}
                      onClick={() => { setViewMode('subject'); setActiveSubject(sub); handleBackToDashboard(); }}
                      className={`px-3 py-1 rounded-lg border-2 text-[9px] font-black uppercase transition-all shadow-sm ${
                        viewMode === 'subject' && activeSubject === sub
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-blue-600 border-blue-600/30 active:scale-95'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                  {viewMode === 'subject' && (
                    <button
                      onClick={() => { setViewMode('class'); handleBackToDashboard(); }}
                      className="px-3 py-1 rounded-lg border-2 border-slate-200 text-slate-400 bg-white text-[9px] font-black uppercase shadow-sm active:scale-95"
                    >
                      Class Overview
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                {activeSubject} Teacher
              </p>
            )}
          </div>
        </div>
        
        <button 
          onClick={onLogout} 
          className="p-3 bg-transparent active:bg-blue-50 transition-all rounded-xl border-2 border-blue-600 text-blue-600 flex items-center justify-center active:scale-95 shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      <div className={`flex-1 overflow-y-auto px-6 pb-24 relative z-10 space-y-8 ${isCT ? 'pt-48' : 'pt-40'}`}>
        
        {viewingClassStudents ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <button onClick={handleBackToDashboard} className="p-2 bg-white rounded-xl border-2 border-blue-600 text-blue-600 shadow-sm active:scale-90">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-sm font-black text-white uppercase tracking-widest drop-shadow-md">
                {viewingClassStudents} • Student Insight
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {MOCK_STUDENTS.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="bg-white p-5 rounded-[2.5rem] border-2 border-white shadow-md flex flex-col items-start active:border-blue-600 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs mb-4">
                    {student.name[0]}
                  </div>
                  <h4 className="text-sm font-black text-slate-800 leading-tight mb-1 truncate w-full">{student.name}</h4>
                  <div className="mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${student.activeLevel[activeSubject!] === 'High' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {student.activeLevel[activeSubject!] || 'Average'} Active
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <section className="animate-fade-in space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-md">
                  {viewMode === 'class' ? 'Class Analysis' : 'Subject Analysis'}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/95 p-6 rounded-[2.5rem] border border-blue-50 shadow-lg flex flex-col">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {viewMode === 'class' ? 'Class Pass Status' : 'Subject Pass %'}
                  </p>
                  <div className="flex items-end space-x-1">
                    <span className="text-3xl font-black text-slate-900 leading-none">
                      {viewMode === 'class' ? '82%' : '88%'}
                    </span>
                  </div>
                  <p className="text-[8px] font-black text-blue-500 uppercase mt-2">
                    Good
                  </p>
                </div>
                <div className="bg-white/95 p-6 rounded-[2.5rem] border border-blue-50 shadow-lg flex flex-col">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {viewMode === 'class' ? 'Class Attendance' : 'Active Status'}
                  </p>
                  <div className="flex items-end space-x-1">
                    <span className="text-3xl font-black text-slate-900 leading-none">
                      High
                    </span>
                  </div>
                  <p className="text-[8px] font-black text-blue-500 uppercase mt-2">
                    {viewMode === 'class' ? 'Average' : 'High'}
                  </p>
                </div>
              </div>
            </section>

            {isCT && pendingStudents.length > 0 && (
              <section className="animate-slide-up space-y-4">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Pending Student Approvals</h2>
                <div className="grid grid-cols-1 gap-4">
                  {pendingStudents.map(student => {
                    const isAnimating = animatingApprovalId === student.id;
                    return (
                      <div 
                        key={student.id} 
                        className={`bg-white p-6 rounded-[3.5rem] border border-slate-100 shadow-md flex items-center space-x-6 transition-all duration-700 ${isAnimating ? 'opacity-100 border-blue-100' : 'opacity-60'}`}
                      >
                        <ApprovalMascot isApproved={isAnimating} />
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <h3 className="text-lg font-black text-slate-800 leading-tight">{student.name}</h3>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{student.grade} • {student.language}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-colors duration-500 border ${isAnimating ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                              {isAnimating ? 'Approved' : 'Pending Approval'}
                            </span>
                          </div>
                          
                          {!isAnimating && (
                            <div className="flex space-x-3 pt-1">
                              <button 
                                onClick={() => setApprovingStudent(student)}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-md active:scale-[0.98] transition-all"
                              >
                                ✅ Approve
                              </button>
                              <button 
                                onClick={() => setRejectingStudent(student)}
                                className="flex-1 py-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest active:bg-red-50 active:text-red-500 active:border-red-100 active:scale-[0.98] transition-all"
                              >
                                ❌ Reject
                              </button>
                            </div>
                          )}
                          
                          {isAnimating && (
                            <div className="pt-2">
                               <p className="text-[10px] text-blue-600 font-bold uppercase animate-pulse">Syncing profile...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {viewMode === 'class' && (
              <section className="animate-slide-up space-y-4">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Enrolled Students</h2>
                <div className="grid grid-cols-2 gap-4">
                  {MOCK_STUDENTS.map(student => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="bg-white p-5 rounded-[2.5rem] border-2 border-white shadow-md flex flex-col items-start active:border-blue-600 transition-all text-left group"
                    >
                      <div className="flex justify-between w-full mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                          {student.name[0]}
                        </div>
                        {renderPerformanceBadge(student.performance)}
                      </div>
                      <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">{student.name}</h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ROLL: TN-IX-0{student.id}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {viewMode === 'subject' && (
              <>
                <section className="animate-slide-up grid grid-cols-1 gap-6">
                  <div className="bg-white p-8 rounded-[3rem] border border-blue-50 shadow-xl space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Curriculum Status</h3>
                    <div className="flex items-center">
                      <div className="h-40 w-40 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Units Completed', value: 12 },
                                { name: 'Units In Progress', value: 4 },
                                { name: 'Units Pending', value: 6 },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {[
                                { name: 'Units Completed', value: 12 },
                                { name: 'Units In Progress', value: 4 },
                                { name: 'Units Pending', value: 6 },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 pl-6 space-y-3">
                        {[
                          { name: 'Units Completed', value: 12 },
                          { name: 'Units In Progress', value: 4 },
                          { name: 'Units Pending', value: 6 },
                        ].map((entry, index) => (
                          <div key={entry.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{entry.name}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-900">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[3rem] border border-blue-50 shadow-xl space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Class Performance</h3>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { name: '9-A', score: 85 },
                            { name: '9-B', score: 78 },
                            { name: '10-A', score: 92 },
                            { name: '10-B', score: 81 },
                          ]} 
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                            domain={[0, 100]}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={32}>
                            {[
                              { name: '9-A', score: 85 },
                              { name: '9-B', score: 78 },
                              { name: '10-A', score: 92 },
                              { name: '10-B', score: 81 },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill="#3b82f6" />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>

                <section className="animate-slide-up space-y-4">
                  <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Subject Control</h2>
                  <div className="space-y-4">
                    {assignedClasses.map(cls => (
                      <div key={cls} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col space-y-5">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-[#2563eb] text-xl font-black shadow-sm border border-blue-100/50">
                            {cls.split(' ')[1]}
                          </div>
                          <div>
                            <h3 className="font-black text-slate-800 text-lg leading-tight">{cls}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Assigned Class</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button 
                            onClick={() => onSelectSubject(activeSubject!, cls)}
                            className="py-3 px-4 bg-white border-2 border-[#2563eb] text-[#2563eb] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm active:bg-blue-50 active:scale-95 transition-all"
                          >
                            Manage Topics
                          </button>
                          <button 
                            onClick={() => setViewingClassStudents(cls)}
                            className="py-3 px-4 bg-white border-2 border-[#2563eb] text-[#2563eb] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm active:bg-blue-50 active:scale-95 transition-all"
                          >
                            Student Insight
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="animate-slide-up space-y-4">
                  <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Common Struggling Topics</h2>
                  <div className="bg-white p-6 rounded-[2.5rem] border-2 border-blue-50 shadow-md space-y-6">
                    <div className="flex p-1 bg-slate-100 rounded-2xl">
                      {assignedClasses.map(cls => (
                        <button
                          key={cls}
                          onClick={() => setStrugglingClassToggle(cls)}
                          className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${strugglingClassToggle === cls ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {['Algebraic Identities', 'Polynomial Division'].map(topic => (
                        <div key={topic} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-xs font-bold text-slate-700">{topic}</span>
                          <span className="text-[10px] font-black text-red-500 uppercase">12 Students</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>

      {approvingStudent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setApprovingStudent(null)} />
          <div className="relative w-full max-w-xs bg-white rounded-[2.5rem] p-8 shadow-2xl animate-slide-up text-center space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Approve Student?</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Approve <span className="text-blue-600 font-bold">{approvingStudent.name}</span> for {approvingStudent.grade}?
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={handleConfirmApproval}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-md active:scale-95 transition-all"
              >
                Approve
              </button>
              <button 
                onClick={() => setApprovingStudent(null)}
                className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest active:bg-slate-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectingStudent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setRejectingStudent(null)} />
          <div className="relative w-full max-w-xs bg-white rounded-[2.5rem] p-8 shadow-2xl animate-slide-up text-center space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Reject Student?</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Reject <span className="text-red-600 font-bold">{rejectingStudent.name}</span>'s request to join {rejectingStudent.grade}?
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={handleConfirmRejection}
                className="w-full py-4 bg-white border-2 border-red-100 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest active:bg-red-50 active:scale-95 transition-all"
              >
                Reject
              </button>
              <button 
                onClick={() => setRejectingStudent(null)}
                className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest active:bg-slate-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={() => { setSelectedStudent(null); setSelectedProfileSubject(null); }} />
          <div className="relative w-full h-[90%] bg-white rounded-t-[3.5rem] shadow-2xl animate-slide-up flex flex-col overflow-hidden">
            <div className="w-full flex justify-center pt-5 pb-2 shrink-0"><div className="w-14 h-1.5 bg-slate-100 rounded-full" /></div>
            
            <div className="flex-1 overflow-y-auto px-7 py-6 pb-12">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{selectedStudent.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: TN-ST-0{selectedStudent.id}</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedStudent(null); setSelectedProfileSubject(null); }} className="p-3 bg-slate-50 text-slate-400 rounded-2xl active:text-blue-600">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-8">
                {viewMode === 'class' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Performance</p>
                        <p className="text-2xl font-black text-blue-600">{selectedStudent.performance}</p>
                      </div>
                      <div className="bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Active Score</p>
                        <p className="text-2xl font-black text-indigo-600">High</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Academic Progress</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => setSelectedProfileSubject(selectedProfileSubject === s ? null : s)}
                            className={`p-5 rounded-3xl border-2 transition-all text-left flex flex-col space-y-3 ${selectedProfileSubject === s ? 'bg-blue-50 border-blue-600' : 'bg-white border-slate-50 shadow-sm'}`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="font-black text-slate-800">{s}</span>
                              <svg viewBox="0 0 24 24" className={`w-4 h-4 text-slate-400 transition-transform ${selectedProfileSubject === s ? 'rotate-180 text-blue-600' : ''}`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
                            </div>
                            {selectedProfileSubject === s && (
                              <div className="space-y-4 animate-fade-in pt-2">
                                <div className="space-y-1">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Struggling Topics</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {(selectedStudent.struggledTopics[s] || ['Concepts fully understood']).map(t => (
                                      <span key={t} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[9px] font-black border border-red-100">{t}</span>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                                  <span className="text-[9px] font-black text-slate-400 uppercase">Active Level</span>
                                  <span className="text-[9px] font-black text-blue-600 uppercase">{selectedStudent.activeLevel[s] || 'Average'}</span>
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 p-8 rounded-[2.5rem] border-2 border-blue-100 space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xl font-black text-blue-700 uppercase tracking-widest">{activeSubject}</h4>
                        <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase">{selectedStudent.activeLevel[activeSubject!] || 'Average'} Active</span>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Struggling Concepts</p>
                        <div className="grid grid-cols-1 gap-2">
                          {(selectedStudent.struggledTopics[activeSubject!] || ['No issues reported']).map(topic => (
                            <div key={topic} className="p-4 bg-white rounded-2xl border border-blue-100 text-sm font-bold text-slate-700 flex items-center shadow-sm">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
