import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { UserPreferences } from '../App';
import DashboardHeader from '../components/DashboardHeader';
import { aiService } from '../services/aiService';

interface QuizScreenProps {
  preferences: UserPreferences;
  unitName: string;
  lessonTitle?: string;
  onComplete: () => void;
  onRevise: () => void;
  onExit: () => void;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  optionExplanations: string[];
}

const ALGEBRA_LESSONS = [
  "Introduction to Algebra",
  "Algebraic Expressions",
  "Simplification of Algebraic Expressions",
  "Polynomials",
  "Degree of a Polynomial",
  "Addition and Subtraction of Polynomials",
  "Multiplication of Polynomials",
  "Algebraic Identities",
  "Factorisation",
  "Simple Algebraic Word Problems",
  "Revision & Board-Oriented Problems",
];

const QuizScreen: React.FC<QuizScreenProps> = ({ preferences, unitName, lessonTitle, onComplete, onRevise, onExit }) => {
  const [step, setStep] = useState<'selection' | 'loading' | 'active' | 'summary'>('selection');
  const [quizType, setQuizType] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string>(lessonTitle || `Whole Unit — ${unitName}`);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTypeSelect = async (type: string) => {
    setQuizType(type);
    setStep('loading');
    
    const effectiveLessonTitle = selectedLesson.startsWith('Whole Unit') ? undefined : selectedLesson;
    
    try {
      const data = await aiService.generateQuiz(
        unitName, 
        preferences.assignedSubject || 'General', 
        preferences.selectedClass || 9,
        type,
        preferences,
        effectiveLessonTitle
      );
      setQuestions(data);
      setStep('active');
    } catch (e) {
      console.error(e);
      onExit();
    }
  };

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    const correct = index === questions[currentQuestionIndex].correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
  };

  const handleAction = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setIsCorrect(null);
    } else {
      setStep('summary');
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsCorrect(null);
    setStep('selection');
  };

  if (step === 'selection') {
    return (
      <div className="h-full flex flex-col relative animate-fade-in overflow-hidden">
        <DashboardHeader preferences={preferences} title="Practice Mode" />
        
        {/* Lesson Selector Dropdown */}
        <div className="relative z-20 px-8 pt-6 w-full max-w-sm">
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-2 ml-1">Practice Quiz For:</p>
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#f0f7ff] border-2 border-[#2563eb] px-6 py-4 rounded-2xl flex items-center justify-between shadow-lg active:scale-[0.99] transition-all"
            >
              <span className="text-sm font-bold text-slate-800 truncate pr-4">
                {selectedLesson}
              </span>
              <ChevronDown size={18} className={`text-[#2563eb] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#f0f7ff] border-2 border-[#2563eb]/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto"
                >
                  <button 
                    onClick={() => { setSelectedLesson(`Whole Unit — ${unitName}`); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-wide border-b border-blue-50 transition-colors ${selectedLesson === `Whole Unit — ${unitName}` ? 'bg-blue-100 text-[#2563eb]' : 'text-slate-600 hover:bg-blue-50'}`}
                  >
                    🟦 Whole Unit — {unitName}
                  </button>
                  {ALGEBRA_LESSONS.map((lesson) => (
                    <button 
                      key={lesson}
                      onClick={() => { setSelectedLesson(lesson); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-6 py-4 text-xs font-bold transition-colors border-b border-blue-50 last:border-0 ${selectedLesson === lesson ? 'bg-blue-100 text-[#2563eb]' : 'text-slate-600 hover:bg-blue-50'}`}
                    >
                      {lesson}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col justify-center items-center text-center relative z-10">
          <div className="w-24 h-24 bg-[#f0f7ff] border-2 border-[#2563eb]/20 rounded-[3rem] flex items-center justify-center mb-8 shadow-xl"><span className="text-5xl">🎯</span></div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3 drop-shadow-md">Choose Intent</h2>
          <p className="text-blue-100 mb-10 max-w-xs text-sm font-bold uppercase tracking-wide opacity-80">15 Questions Generated for You</p>
          
          <div className="w-full space-y-4 max-w-sm">
            {[
              { id: 'Book Back Exercise Questions', label: 'Book Back Questions', sub: 'Standard Practice', icon: '📖' },
              { id: 'Concept-Based Questions', label: 'Concept Mastery', sub: 'Deep Understanding', icon: '💡' },
              { id: 'Competitive Exam–Related Questions', label: 'Competitive Edge', sub: 'Exam-Level Difficulty', icon: '🏆' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => handleTypeSelect(item.id)} 
                className="w-full p-6 bg-[#f0f7ff] border-2 border-[#2563eb]/20 rounded-[2.5rem] shadow-sm flex items-center space-x-5 active:scale-[0.98] active:border-[#2563eb] active:bg-blue-50 transition-all text-left group"
              >
                <span className="text-3xl grayscale group-active:grayscale-0 transition-all">{item.icon}</span>
                <div>
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">{item.label}</h3>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1 opacity-60 group-active:opacity-100">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
          
          <button onClick={onExit} className="mt-12 text-blue-900/40 font-black text-[10px] uppercase tracking-[0.3em] active:text-[#2563eb] transition-colors">Cancel Practice</button>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#eff6ff] p-12 text-center animate-fade-in">
        <div className="w-16 h-16 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mb-10"></div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Generating Quiz</h2>
        <p className="text-slate-400 font-black uppercase tracking-[0.15em] text-[10px]">Assembling 15 custom items...</p>
      </div>
    );
  }

  if (step === 'active') {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    
    return (
      <div className="h-full flex flex-col relative animate-fade-in overflow-hidden">
        <DashboardHeader preferences={preferences} title={lessonTitle || unitName} />
        <div className="w-full h-1.5 bg-white/20 relative z-10"><div className="h-full bg-yellow-400 transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${progress}%` }}></div></div>
        
        <div className="px-6 py-4 flex items-center justify-between relative z-10 sticky top-[136px] bg-transparent">
          <button 
            onClick={onExit}
            className="flex items-center bg-[#f0f7ff] border-2 border-[#2563eb] text-[#2563eb] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-[0.98] active:bg-blue-50 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Exit</span>
          </button>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">Q {currentQuestionIndex + 1} / {questions.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col relative z-10">
          <div className="bg-[#f0f7ff] rounded-[2.5rem] p-10 border-2 border-[#2563eb]/10 shadow-2xl mb-10">
            <h2 className="text-xl font-bold text-slate-800 leading-tight">{question.text}</h2>
          </div>
          
          <div className="space-y-4 mb-10">
            {question.options.map((option, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrectOption = idx === question.correctIndex;
              
              let borderClass = 'border-[#2563eb]/20';
              let bgClass = 'bg-[#f0f7ff]';
              let textClass = 'text-slate-800';

              if (showExplanation) {
                if (isCorrectOption) {
                  borderClass = 'border-green-500';
                  bgClass = 'bg-green-50';
                  textClass = 'text-green-800';
                } else if (isChosen && !isCorrectOption) {
                  borderClass = 'border-red-500';
                  bgClass = 'bg-red-50';
                  textClass = 'text-red-800';
                }
              }

              return (
                <div key={idx} className="flex flex-col space-y-2">
                  <button 
                    onClick={() => handleOptionSelect(idx)} 
                    disabled={showExplanation} 
                    className={`w-full p-6 rounded-[2rem] border-2 transition-all text-left font-bold active:scale-[0.98] shadow-sm flex items-center space-x-5 ${borderClass} ${bgClass} ${textClass} ${showExplanation && !isChosen && !isCorrectOption ? 'opacity-40' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-xs shrink-0 ${isChosen ? 'bg-[#2563eb] text-white border-[#2563eb]' : 'border-[#2563eb]/10 text-slate-300'}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-base">{option}</span>
                  </button>
                  
                  {showExplanation && (isChosen || isCorrectOption) && (
                    <div className={`px-8 py-5 rounded-[1.75rem] text-[11px] font-bold leading-relaxed animate-slide-up shadow-inner ${isCorrectOption ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {(question.optionExplanations[idx] || '').split('---').map((part, i) => (
                        <p key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-black/5 italic' : ''}>
                          {part.trim()}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="p-8 border-t border-blue-100 bg-[#f0f7ff] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
            <button 
              onClick={handleAction} 
              className="w-full py-6 bg-[#2563eb] text-white font-black uppercase tracking-[0.25em] text-xs rounded-3xl shadow-xl active:scale-[0.98] active:bg-blue-700 transition-all"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-10 bg-[#eff6ff] animate-fade-in text-center overflow-hidden relative">
      <div className="w-28 h-28 bg-blue-50 rounded-[3rem] flex items-center justify-center mb-10 relative border-2 border-blue-100 shadow-xl">
        <div className="absolute inset-0 bg-blue-100 rounded-[3rem] animate-ping opacity-20 scale-125"></div>
        <span className="text-5xl">🏆</span>
      </div>
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Practice Complete</h2>
      <p className="text-slate-400 mb-14 max-w-xs mx-auto font-bold uppercase tracking-widest text-[10px] leading-relaxed">
        Great session! You've reinforced your understanding for {lessonTitle || unitName}.
      </p>
      <div className="w-full space-y-4 max-w-sm">
        <button 
          onClick={handleRetry} 
          className="w-full py-5 bg-[#f0f7ff] border-2 border-[#2563eb] text-[#2563eb] font-black uppercase tracking-widest text-xs rounded-2xl active:scale-[0.98] active:bg-blue-50 transition-all shadow-sm"
        >
          Retry Session
        </button>
        <button 
          onClick={onRevise} 
          className="w-full py-5 bg-[#2563eb] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl active:scale-[0.98] active:bg-blue-700 transition-all"
        >
          Review Lesson
        </button>
        <button onClick={onComplete} className="w-full py-5 text-slate-300 font-black uppercase tracking-widest text-[10px] active:text-[#2563eb] transition-colors mt-4">Close Quiz</button>
      </div>
    </div>
  );
};

export default QuizScreen;