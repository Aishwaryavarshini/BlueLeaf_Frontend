
import React, { useState } from 'react';

interface LoginScreenProps {
  onSuccess: (email: string) => void;
  onBack: () => void;
  onGoToSignUp: () => void;
  onForgotPassword: () => void;
  feedbackMessage?: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onBack, onGoToSignUp, onForgotPassword, feedbackMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(email);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="pt-12 px-6 relative z-10">
        <button 
          onClick={onBack}
          className="mb-6 p-2 -ml-2 text-white/50 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
        <p className="text-white mt-2 text-lg">Login to continue your journey</p>
      </div>

      <form onSubmit={handleLogin} className="flex-1 p-6 space-y-6 mt-8 overflow-y-auto relative z-10">
        {feedbackMessage && (
          <div className="bg-green-100/20 backdrop-blur-sm border border-green-400/30 p-4 rounded-xl text-white text-sm font-bold animate-fade-in flex items-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {feedbackMessage}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-white/80 ml-1">Email ID</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-4 rounded-xl border-2 border-white/20 bg-[#f0f7ff] text-black placeholder:text-slate-400 outline-none transition-all font-medium"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-white/80 ml-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 pr-12 rounded-xl border-2 border-white/20 bg-[#f0f7ff] text-black placeholder:text-slate-400 outline-none transition-all font-medium"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2563eb] transition-colors"
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          <div className="text-right">
            <button 
              type="button"
              onClick={onForgotPassword}
              className="text-white/60 text-xs font-bold hover:text-white transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 bg-[#2563eb] text-white font-bold text-lg rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center group"
          >
            Login
            <span className="ml-2">→</span>
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4 pt-4 pb-10">
          <p className="text-white/60 text-sm font-medium">
            Don't have an account? <button type="button" onClick={onGoToSignUp} className="text-white font-bold hover:underline">Sign Up</button>
          </p>
          <p className="text-white/40 text-[11px] font-medium text-center">
            Student: student@blueleaf.com • Pending: pending@blueleaf.com<br/>Institution: admin@blueleaf.com
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
