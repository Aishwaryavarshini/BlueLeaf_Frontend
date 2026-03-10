
import React from 'react';
import Logo from '../components/Logo';

interface WelcomeScreenProps {
  onStart: () => void;
  onLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onLogin }) => {
  return (
    <div className="h-[100dvh] flex flex-col items-center animate-fade-in overflow-hidden px-8">
      
      {/* Top Section: Logo & Headline */}
      <div className="pt-[10dvh] flex flex-col items-center w-full text-center">
        <Logo size="lg" className="mb-[4dvh]" />
        
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2 drop-shadow-md">
          Learn smarter.
        </h1>
      </div>

      {/* Main Content Group */}
      <div className="flex-1 flex flex-col items-center justify-center w-full text-center">
        
        {/* Subtext */}
        <div className="space-y-1 mb-[6dvh]">
          <p className="text-xs sm:text-sm font-black tracking-[0.18em] text-blue-900/80 uppercase">
            AI THAT ADAPTS TO YOU
          </p>
          <p className="text-xs sm:text-sm font-black tracking-[0.18em] text-blue-900/80 uppercase">
            INSIDE THE SYLLABUS.
          </p>
        </div>

        {/* Action Section: Thumb reachable area */}
        <div className="w-full max-w-sm space-y-4 mt-auto pb-[8dvh]">
          <button
            onClick={onStart}
            className="w-full py-4 sm:py-5 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white font-bold text-lg sm:text-xl rounded-full shadow-[0_12px_24px_-8px_rgba(37,99,235,0.45)] active:scale-[0.96] transition-all flex items-center justify-center group"
          >
            <span>Start Journey</span>
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
          
          <div className="text-center">
            <p className="text-slate-500 font-medium text-sm">
              Already have an account?{' '}
              <button 
                onClick={onLogin}
                className="text-[#2563eb] font-bold hover:underline active:opacity-70 transition-all"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
