
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from 'recharts';
import { UserPreferences } from '../App';

interface PrincipalDashboardProps {
  preferences: UserPreferences;
  onLogout: () => void;
  onAddStaff: () => void;
  onSelectClass: (className: string) => void;
}

const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ preferences, onLogout, onAddStaff, onSelectClass }) => {
  const classes = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Class ${i + 1}`,
    shortName: `${i + 1}`,
    performance: 75 + Math.floor(Math.random() * 20),
    studentCount: 110 + Math.floor(Math.random() * 20)
  })), []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-blue-50 animate-in fade-in zoom-in duration-200">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Class: {data.name}</p>
          <p className="text-xs font-bold text-slate-800">Students: {data.studentCount}</p>
          <p className="text-xs font-bold text-slate-800">Mastery: {data.performance}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-white">
      {/* STATIC APP BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />

      {/* HEADER - STRICT FLAT RECTANGLE, WHITE BG, BLUE TEXT */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center px-6 h-32 border-b border-slate-100">
        <div className="flex-1 flex flex-col text-[#2563eb] space-y-0.5">
          <h1 className="text-lg font-black uppercase tracking-tight leading-tight truncate">
            TAMIL NADU GOVERNMENT SCHOOL
          </h1>
          <p className="text-sm font-bold">Rajesh</p>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">
            BOARD: STATE BOARD
          </p>
        </div>
        
        <button 
          onClick={onLogout} 
          className="p-3 text-[#2563eb] active:scale-95 transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-5 pt-40 pb-24 relative z-10 space-y-6">
        
        {/* STUDENT OVERVIEW SECTION - Horizontal Layout, Fixed Ring Chart */}
        <section className="animate-fade-in">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex items-center justify-between border border-slate-50 overflow-visible cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] group">
            <div className="flex flex-col">
              <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">1,420</p>
              <p className="text-[10px] font-black text-blue-600 uppercase mt-2 tracking-widest">TOTAL STUDENTS</p>
            </div>

            <div className="relative w-24 h-24 flex items-center justify-center overflow-visible">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f472b6" /* Pink */
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#2563eb" /* Blue */
                  strokeWidth="12"
                  strokeDasharray="251.32"
                  strokeDashoffset="100.5"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* TEACHING STAFF SECTION - Functional Plus Trigger */}
        <section className="animate-slide-up">
          <div 
            onClick={onAddStaff}
            className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative border border-slate-50 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col">
                <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">48</p>
                <p className="text-[10px] font-black text-blue-600 uppercase mt-2 tracking-widest">TEACHING STAFF</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddStaff(); }}
                className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 active:scale-90 transition-transform shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>

            <div className="flex flex-col space-y-4 pt-6 border-t border-slate-50">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PRIMARY</p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">16</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SECONDARY</p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">18</p>
              </div>
            </div>
          </div>
        </section>

        {/* PERFORMANCE ANALYTICS SECTION - Bar Graph */}
        <section className="animate-slide-up">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50">
            <div className="mb-8">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Class Performance Overview</h2>
              <p className="text-[10px] font-black text-blue-600 uppercase mt-2 tracking-widest">Mastery levels across all grades</p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classes}
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="shortName" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: '#f8fafc', opacity: 0.4 }}
                  />
                  <Bar 
                    dataKey="performance" 
                    radius={0}
                    barSize={20}
                    animationDuration={1500}
                  >
                    {classes.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill="#2563eb"
                        className="cursor-pointer transition-all duration-200 hover:fill-blue-700 active:scale-y-95"
                        style={{ transformOrigin: 'bottom' }}
                        onClick={() => onSelectClass(entry.shortName)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 flex justify-between items-center px-2">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mastery %</span>
                </div>
              </div>
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Interactive Analytics</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
