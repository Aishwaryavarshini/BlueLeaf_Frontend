
import React, { useMemo, useState } from 'react';
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

interface PrincipalSubjectViewScreenProps {
  preferences: UserPreferences;
  className: string;
  subjectName: string;
  onBack: () => void;
  onGoToDashboard: () => void;
  onGoToClass: () => void;
  onSelectStudent: (student: any) => void;
}

const COLORS = ['#22c55e', '#3b82f6', '#ef4444']; // Strong, Improving, Needs Attention

const MOCK_STUDENTS = [
  { id: 1, name: 'Arun Kumar', status: 'Strong', mastery: 92, section: 'Sec A' },
  { id: 2, name: 'Priya Dharshini', status: 'Improving', mastery: 84, section: 'Sec B' },
  { id: 3, name: 'Senthil Nathan', status: 'Needs Attention', mastery: 65, section: 'Sec C' },
  { id: 4, name: 'Kavitha Devi', status: 'Strong', mastery: 95, section: 'Sec D' },
  { id: 5, name: 'Muthu Selvam', status: 'Improving', mastery: 78, section: 'Sec A' },
  { id: 6, name: 'Vijay Raman', status: 'Strong', mastery: 88, section: 'Sec B' },
  { id: 7, name: 'Deepika S.', status: 'Needs Attention', mastery: 58, section: 'Sec C' },
  { id: 8, name: 'Anand R.', status: 'Improving', mastery: 72, section: 'Sec D' },
];

const PrincipalSubjectViewScreen: React.FC<PrincipalSubjectViewScreenProps> = ({
  preferences,
  className,
  subjectName,
  onBack,
  onGoToDashboard,
  onGoToClass,
  onSelectStudent
}) => {
  const [activeSectionFilter, setActiveSectionFilter] = useState<string | null>(null);

  const sectionData = useMemo(() => [
    { name: 'Sec A', mastery: 88 },
    { name: 'Sec B', mastery: 82 },
    { name: 'Sec C', mastery: 75 },
    { name: 'Sec D', mastery: 92 },
  ], []);

  const statusData = useMemo(() => [
    { name: 'Strong', value: 45 },
    { name: 'Improving', value: 35 },
    { name: 'Needs Attention', value: 20 },
  ], []);

  const topics = {
    strong: ['Algebraic Identities', 'Polynomial Division', 'Factorisation'],
    weak: ['Word Problems', 'Complex Simplification']
  };

  const filteredStudents = useMemo(() => {
    if (!activeSectionFilter) return MOCK_STUDENTS;
    return MOCK_STUDENTS.filter(s => s.section === activeSectionFilter);
  }, [activeSectionFilter]);

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-slate-50">
      {/* STATIC APP BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-slate-50 z-0 pointer-events-none" />

      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white h-32 shadow-lg flex flex-col px-6 justify-center">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 mb-2">
          <button onClick={onGoToDashboard} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Principal Dashboard</button>
          <span className="text-slate-300 text-[10px] font-black">/</span>
          <button onClick={onGoToClass} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Class {className}</button>
          <span className="text-slate-300 text-[10px] font-black">/</span>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{subjectName}</span>
        </nav>

        <div className="flex items-center justify-between">
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
              <h1 className="text-xl font-black uppercase leading-tight tracking-tight">{subjectName} Oversight</h1>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-0.5">Subject Performance Dashboard</p>
            </div>
          </div>
          
          <div className="px-5 py-3 bg-blue-50 text-[#2563eb] rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
            Principal View
          </div>
        </div>
      </header>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-6 pt-40 pb-24 relative z-10 space-y-8">
        
        {/* A. Overall Subject Metrics */}
        <section className="animate-fade-in grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-lg flex flex-col">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Mastery</p>
            <span className="text-3xl font-black text-slate-900 leading-none">88%</span>
            <p className="text-[8px] font-black text-green-500 uppercase mt-2">Excellent</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-lg flex flex-col">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quiz Perf.</p>
            <span className="text-3xl font-black text-slate-900 leading-none">82%</span>
            <p className="text-[8px] font-black text-blue-500 uppercase mt-2">Above Avg</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-lg flex flex-col">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Time</p>
            <span className="text-3xl font-black text-slate-900 leading-none">42m</span>
            <p className="text-[8px] font-black text-slate-400 uppercase mt-2">Per Session</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-lg flex flex-col">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion</p>
            <span className="text-3xl font-black text-slate-900 leading-none">74%</span>
            <p className="text-[8px] font-black text-blue-500 uppercase mt-2">Syllabus</p>
          </div>
        </section>

        {/* B. Class-wise Subject Performance */}
        <section className="animate-slide-up">
          <div className="bg-white p-8 rounded-[3rem] border border-blue-50 shadow-xl space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Section Performance</h3>
                <p className="text-[8px] font-bold text-blue-400 uppercase mt-1">Click bars to filter students</p>
              </div>
              {activeSectionFilter && (
                <button 
                  onClick={() => setActiveSectionFilter(null)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-100"
                >
                  Clear Filter: {activeSectionFilter}
                </button>
              )}
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sectionData} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onClick={(data: any) => {
                    if (data && data.activePayload && data.activePayload.length > 0) {
                      setActiveSectionFilter(data.activePayload[0].payload.name);
                    }
                  }}
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
                  <Bar dataKey="mastery" radius={[8, 8, 0, 0]} barSize={40}>
                    {sectionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={activeSectionFilter === entry.name ? '#2563eb' : '#3b82f6'} 
                        className="cursor-pointer transition-all hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* C. Student Status Breakdown */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white p-8 rounded-[3rem] border border-blue-50 shadow-xl flex items-center">
            <div className="h-48 w-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 pl-8 space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Status</h3>
              <div className="space-y-2">
                {statusData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{entry.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-900">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* D. Student Insight - List of Students */}
        <section className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex justify-between items-center mb-4 ml-2">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Student Insight {activeSectionFilter ? `(${activeSectionFilter})` : ''}</h2>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{filteredStudents.length} Students</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="bg-white p-5 rounded-[2.5rem] border-2 border-white shadow-md flex items-center justify-between active:border-blue-600 transition-all text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                    {student.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-tight">{student.name}</h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Mastery: {student.mastery}%</p>
                      <span className="text-[9px] text-slate-300">•</span>
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">{student.section}</p>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${
                  student.status === 'Strong' ? 'bg-green-50 text-green-600 border-green-100' :
                  student.status === 'Improving' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {student.status}
                </div>
              </button>
            ))}
            {filteredStudents.length === 0 && (
              <div className="py-10 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No students found for this filter</p>
              </div>
            )}
          </div>
        </section>

        {/* E. Top / Bottom Topics */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-8 rounded-[3rem] border border-blue-50 shadow-xl space-y-6">
              <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Strongest Topics</h3>
              <div className="space-y-3">
                {topics.strong.map(topic => (
                  <div key={topic} className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                    <span className="text-xs font-bold text-green-700">{topic}</span>
                    <span className="text-[10px] font-black text-green-600 uppercase">90%+ Mastery</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-[3rem] border border-blue-50 shadow-xl space-y-6">
              <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Weakest Topics</h3>
              <div className="space-y-3">
                {topics.weak.map(topic => (
                  <div key={topic} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                    <span className="text-xs font-bold text-red-700">{topic}</span>
                    <span className="text-[10px] font-black text-red-600 uppercase">Needs Attention</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="pt-10 flex flex-col items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">End of Analytics Report</p>
        </div>
      </div>
    </div>
  );
};

export default PrincipalSubjectViewScreen;
