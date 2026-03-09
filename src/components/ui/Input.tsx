
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
      <input 
        className={`w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#2563eb] focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300 ${error ? 'border-red-300' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>}
    </div>
  );
};
