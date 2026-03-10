
import React, { useState } from 'react';

interface PrincipalStudentProfileScreenProps {
  studentId: string;
  onBack: () => void;
}

interface TopicInsight {
  topic: string;
  performance: number;
  status: string;
  activity: string;
}

const MOCK_TOPIC_INSIGHTS: Record<string, TopicInsight[]> = {
  'Mathematics': [
    { topic: 'Algebraic Identities', performance: 45, status: 'Needs Support', activity: '3 Practice Attempts' },
    { topic: 'Polynomial Division', performance: 92, status: 'Proficient', activity: 'Active 2h ago' },
    { topic: 'Factorization', performance: 78, status: 'Stable', activity: '5 Practice Attempts' },
  ],
  'Science': [
    { topic: 'Newton\'s Laws', performance: 32, status: 'Needs Support', activity: 'Low Engagement' },
    { topic: 'Chemical Bonding', performance: 88, status: 'Proficient', activity: 'Active 10h ago' },
  ]
};

const PrincipalStudentProfileScreen: React.FC<PrincipalStudentProfileScreenProps> = ({ studentId, onBack }) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const student = {
    name: "Lakshmi S.",
    class: "Class 9",
    section: "A",
    status: "Active",
    overallPerformance: 85,
    subjects: [
      { name: 'Mathematics', score: 92, teacher: 'Karthik R.' },
      { name: 'Tamil', score: 88, teacher: 'Murugan P.' },
      { name: 'English', score: 75, teacher: 'Senthil K.' },
      { name: 'Science', score: 82, teacher: 'Revathi S.' },
      { name: 'Social Science', score: 89, teacher: 'Meena R.' }
    ]
  };

  if (selectedSubject) {
    const insights = MOCK_TOPIC_INSIGHTS[selectedSubject] || [];
    return (
      <div className="h-full flex flex-col relative overflow-hidden bg-white animate-fade-in">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white h-32 shadow-lg flex items-center px-6">
          <button onClick={() => setSelectedSubject(null)} className="p-3 bg-transparent text-[#2563eb] rounded-2xl shadow-lg border-2 border-[#2563eb]/20 active:scale-95 active:bg-[#2563eb]/10 transition-all mr-4"><svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7" /></svg></button>
          <div className="flex flex-col text-[#2563eb]">
            <h1 className="text-xl font-black uppercase leading-tight">{selectedSubject}</h1>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-0.5">Topic Insights • {student.name}</p>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 pt-40 pb-20 relative z-10 space-y-6">
          {insights.length > 0 ? insights.map((insight, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2.5rem] border-2 border-white shadow-lg animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 text-base flex-1 pr-4">{insight.topic}</h3>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  insight.status === 'Proficient' ? 'bg-green-50 text-green-600' : insight.status === 'Stable' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                }`}>{insight.status}</span>
              </div>
              <div className="space-y-4">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className={`h-full transition-all duration-1000 ${insight.performance > 80 ? 'bg-green-500' : insight.performance > 50 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${insight.performance}%` }} /></div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Mastery: {insight.performance}%</span>
                  <span>{insight.activity}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-300">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No topic data available yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-white animate-fade-in">
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
          <h1 className="text-xl font-black uppercase leading-tight">{student.name}</h1>
          <p className="text-[10px] font-bold text-[#2563eb]/70 uppercase tracking-widest mt-0.5">{student.class} • Sec {student.section}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pt-40 pb-20 relative z-10 space-y-8">
        <section className="animate-slide-up">
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 ml-2 drop-shadow-md">Performance Summary</h2>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-2 border-white mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Overall Mastery</p>
            <p className="text-5xl font-black text-[#2563eb]">{student.overallPerformance}%</p>
          </div>
        </section>

        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Subject-wise Mastery</h2>
          <div className="grid grid-cols-1 gap-4">
            {student.subjects.map((s, idx) => (
              <button 
                key={s.name} 
                onClick={() => setSelectedSubject(s.name)}
                className="bg-white p-6 rounded-[2.5rem] border-2 border-white shadow-lg flex items-center justify-between transition-all active:border-[#2563eb] active:scale-[0.98] group"
              >
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-slate-800 text-base">{s.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Teacher: {s.teacher}</p>
                  <div className="mt-3 w-4/5 h-1.5 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <span className="text-2xl font-black text-slate-900 group-active:text-[#2563eb]">{s.score}%</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrincipalStudentProfileScreen;
