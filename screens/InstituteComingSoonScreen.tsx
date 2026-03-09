
import React from 'react';
import Logo from '../components/Logo';

interface InstituteComingSoonScreenProps {
  onBack: () => void;
}

const InstituteComingSoonScreen: React.FC<InstituteComingSoonScreenProps> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs mx-auto">
        <div className="mb-8 opacity-60">
          <Logo size="lg" />
        </div>
        
        <div className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
          Coming Soon
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Empowering Educators
        </h2>
        
        <p className="text-slate-600 leading-relaxed mb-8">
          Thank you for your interest in BlueLeaf for Institutes. We're currently building a powerful suite of tools to help you manage classes and track student growth seamlessly.
        </p>

        <div className="w-full h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent mb-8"></div>
        
        <p className="text-slate-400 text-sm italic">
          We'll notify our community once the faculty portal is ready for early access.
        </p>
      </div>

      <button
        onClick={onBack}
        className="mt-8 px-8 py-3 bg-white border border-slate-200 text-slate-600 font-semibold rounded-2xl shadow-sm hover:bg-slate-100 active:scale-95 transition-all"
      >
        ← Back to Role Selection
      </button>
    </div>
  );
};

export default InstituteComingSoonScreen;
