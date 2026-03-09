
import React from 'react';
import Logo from '../components/Logo';

interface PendingApprovalScreenProps {
  onBack: () => void;
}

const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col relative animate-fade-in overflow-hidden">
      {/* GLOBAL STATIC BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 flex flex-col items-center relative z-10 overflow-y-auto px-8 pt-20">
        <div className="flex flex-col items-center text-center max-w-xs mx-auto">
          <div className="mb-10 animate-breathe drop-shadow-2xl">
            <Logo size="md" />
          </div>
          
          <div className="bg-amber-100 text-amber-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center shadow-md border border-white/20">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-3 animate-pulse"></span>
            Pending Approval
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight uppercase tracking-tight">
            Almost there
          </h2>
          
          <p className="text-slate-600 leading-relaxed mb-10 font-bold opacity-80">
            Your profile is currently being reviewed. Your <span className="text-[#2563eb]">Class Coordinator</span> will grant you access shortly.
          </p>

          <div className="w-16 h-1 bg-[#2563eb]/10 rounded-full mb-10"></div>
          
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
            Secure learning environment
          </p>
        </div>

        <button
          onClick={onBack}
          className="mt-auto mb-16 w-full max-w-[260px] py-5 bg-white border-2 border-[#2563eb] text-[#2563eb] font-black uppercase tracking-[0.25em] text-xs rounded-3xl shadow-xl active:scale-[0.98] active:bg-blue-50 transition-all relative z-10"
        >
          ← Return Home
        </button>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PendingApprovalScreen;
