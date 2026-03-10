
import React, { useState, useEffect } from 'react';

interface SignUpScreenProps {
  onSuccess: (data: { 
    name: string; 
    role: string; 
    institute?: string;
    email: string;
    board?: string;
    status: 'Pending' | 'Active';
    selectedClass?: number;
    language?: string;
  }) => void;
  onBack: () => void;
}

const BOARDS = [
  'State Board',
  'Matriculation',
  'CBSE',
  'ICSE',
  'IGCSE'
];

const REGISTERED_INSTITUTES = [
  'Tamil Nadu Government School',
  'St. Mary\'s Academy',
  'Global International School',
  'Loyola Institute',
  'Delhi Public School'
];

const LANGUAGES = [
  'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi', 'English'
];

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

interface CustomSelectProps {
  label: string;
  value: string | number;
  options: (string | number)[];
  onChange: (val: any) => void;
  placeholder: string;
  isInstitution?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, placeholder, isInstitution }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Interaction Rule: No background scrolling while dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSelect = (option: any) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2 relative isolate animate-fade-in">
      <label className={`text-sm font-bold ml-1 ${!isInstitution ? 'text-white/80' : 'text-slate-700'}`}>{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all font-medium ${
          isInstitution 
            ? 'bg-[#f0f7ff] border-blue-100 text-slate-900' 
            : 'bg-white/10 border-white/20 text-white'
        }`}
      >
        <span className={!value ? (isInstitution ? 'text-slate-400' : 'text-white/50') : ''}>
          {value || placeholder}
        </span>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      </div>

      {isOpen && (
        <>
          {/* Interaction Rule: Full-screen invisible backdrop to block interaction and close on outside click */}
          <div 
            className="fixed inset-0 z-[120] bg-transparent pointer-events-auto" 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }} 
          />
          {/* Implementation Rule: 100% Solid white dropdown sitting above UI */}
          <div 
            className="absolute left-0 right-0 mt-2 bg-[#f0f7ff] !opacity-100 border-2 border-blue-100 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.2)] z-[130] overflow-hidden pointer-events-auto ring-1 ring-blue-50 animate-slide-down-fast"
            style={{ 
              animation: 'none',
              transform: 'translateY(0)'
            }}
          >
            <div className="max-h-60 overflow-y-auto bg-[#f0f7ff] !opacity-100">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`p-4 hover:bg-blue-50 transition-colors cursor-pointer text-slate-700 font-bold border-b border-blue-50 last:border-0 ${
                    value === option ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  {typeof option === 'number' ? `Class ${option}` : option}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSuccess, onBack }) => {
  const [role, setRole] = useState<'student' | 'institution'>('student');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institute, setInstitute] = useState('');
  const [grade, setGrade] = useState<number | ''>('');
  const [language, setLanguage] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [board, setBoard] = useState('');

  const isInstitution = role === 'institution';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({ 
      name: isInstitution ? principalName : name, 
      role: role, 
      institute: isInstitution ? name : institute,
      email: email,
      board: isInstitution ? board : undefined,
      selectedClass: role === 'student' ? (grade as number) : undefined,
      language: role === 'student' ? language : undefined,
      status: role === 'student' ? 'Pending' : 'Active'
    });
  };

  return (
    <div className={`h-full flex flex-col transition-all duration-700 relative overflow-hidden`}>
      
      {/* Playful background animation for Student mode */}
      {!isInstitution && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[40%] bg-blue-400 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] bg-blue-300 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>
      )}

      <div className="pt-12 px-6 relative z-10">
        <button 
          onClick={onBack}
          className="mb-6 p-2 -ml-2 text-white/50 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <h2 className="text-3xl font-bold text-white">
          Create Account
        </h2>
        <p className={`mt-1 font-medium transition-colors duration-500 text-white`}>
          {isInstitution ? 'Join the Blue Leaf Learning Academy' : 'Learn Smarter'}
        </p>
      </div>

      {/* Account Type Toggle */}
      <div className="px-6 mt-8 relative z-10">
        <div className={`flex p-1 rounded-2xl transition-colors duration-500 bg-blue-100/10 backdrop-blur-sm border border-white/10`}>
          <button
            onClick={() => setRole('student')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              role === 'student' ? 'bg-[#f0f7ff] text-[#2563eb] shadow-sm' : 'text-white/60'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole('institution')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              role === 'institution' ? 'bg-[#f0f7ff] text-[#2563eb] shadow-sm' : 'text-white/60'
            }`}
          >
            Institution
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5 overflow-y-auto pb-12 relative z-10">
        {/* Dynamic Fields based on Role */}
        {role === 'student' ? (
          <>
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-bold text-white/80 ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder:text-white/40 outline-none transition-all font-medium"
                required
              />
            </div>

            <CustomSelect 
              label="Institute"
              value={institute}
              options={REGISTERED_INSTITUTES}
              onChange={setInstitute}
              placeholder="Select Institute"
              isInstitution={false}
            />

            <CustomSelect 
              label="Grade / Class"
              value={grade}
              options={GRADES}
              onChange={setGrade}
              placeholder="Select Class"
              isInstitution={false}
            />

            <CustomSelect 
              label="Preferred Language of Study"
              value={language}
              options={LANGUAGES}
              onChange={setLanguage}
              placeholder="Select Language"
              isInstitution={false}
            />
          </>
        ) : (
          <>
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-bold text-white/80 ml-1">Principal Name</label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                placeholder="Enter Principal's name"
                className="w-full p-4 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder:text-white/40 outline-none transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-bold text-white/80 ml-1">Institute Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name of your Academy"
                className="w-full p-4 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder:text-white/40 outline-none transition-all font-medium"
                required
              />
            </div>

            <CustomSelect 
              label="Board / Curriculum"
              value={board}
              options={BOARDS}
              onChange={setBoard}
              placeholder="Select Board"
              isInstitution={false}
            />
          </>
        )}

        <div className="space-y-2">
          <label className={`text-sm font-bold ml-1 ${isInstitution ? 'text-slate-700' : 'text-white/80'}`}>Email ID</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={`w-full p-4 rounded-xl border-2 transition-all outline-none font-medium text-black bg-[#f0f7ff] ${isInstitution ? 'border-blue-100 focus:border-[#2563eb]' : 'border-white/20'}`}
            required
          />
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-bold ml-1 ${isInstitution ? 'text-slate-700' : 'text-white/80'}`}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className={`w-full p-4 pr-12 rounded-xl border-2 transition-all outline-none font-medium text-black bg-[#f0f7ff] ${isInstitution ? 'border-blue-100 focus:border-[#2563eb]' : 'border-white/20'}`}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2563eb] transition-colors"
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className={`w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-all bg-[#2563eb] hover:bg-blue-700 shadow-blue-200/50`}
          >
            Create Account
          </button>
        </div>

        <p className={`text-center text-xs mt-4 ${isInstitution ? 'text-slate-400' : 'text-white/40'}`}>
          By signing up, you agree to our terms of learning.
        </p>
      </form>
    </div>
  );
};

export default SignUpScreen;
