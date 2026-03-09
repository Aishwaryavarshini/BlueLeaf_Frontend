
import React, { useState } from 'react';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, API call happens here.
    setIsSent(true);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-[#2563eb] from-0% via-[#2563eb] via-50% to-white to-75%">
      <div className="pt-12 px-6 relative z-10">
        <button 
          onClick={onBack}
          className="mb-6 p-2 -ml-2 text-white/50 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
        <p className="text-white mt-2 text-lg">Enter your email address to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6 mt-8 relative z-10">
        {isSent && (
          <div className="bg-blue-100/20 backdrop-blur-sm border border-white/30 p-5 rounded-2xl text-white text-sm font-medium animate-fade-in flex items-start">
             <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 shrink-0">
               <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
               </svg>
             </div>
             <p className="leading-relaxed">If an account exists for this email, a reset link has been sent.</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-white/80 ml-1">Email ID</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
            className="w-full p-4 rounded-xl border-2 border-white/20 bg-white text-black placeholder:text-slate-400 outline-none transition-all font-medium"
            required
            disabled={isSent}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSent}
            className={`w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center ${
              isSent ? 'bg-white/20 cursor-not-allowed text-white/50' : 'bg-[#2563eb] hover:bg-blue-700'
            }`}
          >
            {isSent ? 'Link Sent' : 'Send Reset Link'}
          </button>
        </div>

        <div className="flex justify-center pt-2">
          <button 
            type="button" 
            onClick={onBack} 
            className="text-white font-bold text-sm hover:underline"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordScreen;
