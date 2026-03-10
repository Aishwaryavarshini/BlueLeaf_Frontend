
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, CheckSquare, Layers, Folder, FolderOpen, X, Sigma } from 'lucide-react';
import { UserPreferences } from '../App';
import DashboardHeader from '../components/DashboardHeader';

interface MicroLessonPathScreenProps {
  preferences: UserPreferences;
  subjectName: string;
  unitName: string;
  onBack: () => void;
  onSelectLesson: (lessonName: string) => void;
  onSelectQuiz: () => void;
  onSelectMindMap: () => void;
  onSelectFlashcards: () => void;
  onSelectKeyFormulas: () => void;
}

type LessonStatus = 'completed' | 'in-progress' | 'locked';

interface Lesson {
  id: number;
  title: string;
  status: LessonStatus;
}

const ALGEBRA_LESSONS: Lesson[] = [
  { id: 1, title: "Introduction to Algebra", status: "completed" },
  { id: 2, title: "Algebraic Expressions", status: "completed" },
  { id: 3, title: "Simplification of Algebraic Expressions", status: "completed" },
  { id: 4, title: "Polynomials", status: "in-progress" },
  { id: 5, title: "Degree of a Polynomial", status: "locked" },
  { id: 6, title: "Addition and Subtraction of Polynomials", status: "locked" },
  { id: 7, title: "Multiplication of Polynomials", status: "locked" },
  { id: 8, title: "Algebraic Identities", status: "locked" },
  { id: 9, title: "Factorisation", status: "locked" },
  { id: 10, title: "Simple Algebraic Word Problems", status: "locked" },
  { id: 11, title: "Revision & Board-Oriented Problems", status: "locked" },
];

const MicroLessonPathScreen: React.FC<MicroLessonPathScreenProps> = ({
  preferences,
  subjectName,
  unitName,
  onBack,
  onSelectLesson,
  onSelectQuiz,
  onSelectMindMap,
  onSelectFlashcards,
  onSelectKeyFormulas,
}) => {
  const [tooltip, setTooltip] = useState<number | null>(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallScreen = windowWidth < 640;
  const spreadMultiplier = isSmallScreen ? 0.7 : 1;

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.status === 'locked') {
      setTooltip(lesson.id);
      setTimeout(() => setTooltip(null), 2000);
      return;
    }
    onSelectLesson(lesson.title);
  };

  const handleToolClick = (toolTitle: string) => {
    setIsToolsOpen(false);
    if (toolTitle === 'Mock Quiz') {
      onSelectQuiz();
    } else if (toolTitle === 'Mind Map') {
      onSelectMindMap();
    } else if (toolTitle === 'Flashcards') {
      onSelectFlashcards();
    } else if (toolTitle === 'Key Formulas') {
      onSelectKeyFormulas();
    }
  };

  const revisionTools = [
    { title: 'Mind Map', desc: 'Visual summary of concepts', icon: '🧠' },
    { title: 'Key Formulas', desc: 'Quick reference sheet', icon: '📝' },
    { title: 'Flashcards', desc: 'Active recall practice', icon: '🃏' },
    { title: 'Mock Quiz', desc: 'Test your understanding', icon: '🎯' },
  ];

  return (
    <div className="h-full flex flex-col relative animate-fade-in overflow-hidden bg-[#eff6ff]">
      <DashboardHeader 
        preferences={preferences} 
        title={`${subjectName} – ${unitName}`} 
      />

      {/* Breadcrumb / Back button area */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-[136px] bg-transparent z-10">
        <button 
          onClick={onBack}
          className="flex items-center bg-[#f0f7ff] border-2 border-[#2563eb] text-[#2563eb] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest active:scale-[0.98] active:bg-blue-50 transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Units</span>
        </button>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">Learning Path</span>
      </div>

      {/* Learning Path */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 relative z-10">
        <div className="relative py-12 flex flex-col items-center">
          {/* Path Connecting Line */}
          <div className="absolute top-0 bottom-0 w-1 bg-[#2563eb]/10 left-1/2 -translate-x-1/2 rounded-full z-0"></div>

          {ALGEBRA_LESSONS.map((lesson, index) => {
            const isCompleted = lesson.status === 'completed';
            const isInProgress = lesson.status === 'in-progress';
            const isLocked = lesson.status === 'locked';

            const offsets = [
              'translate-x-0', 
              'translate-x-10', 
              'translate-x-14', 
              'translate-x-8', 
              'translate-x-0', 
              '-translate-x-10', 
              '-translate-x-14', 
              '-translate-x-8'
            ];
            const offsetClass = offsets[index % offsets.length];

            return (
              <div 
                key={lesson.id} 
                className={`flex items-center w-full mb-14 relative z-10 transition-all ${offsetClass}`}
              >
                <div className="flex flex-col items-center flex-1">
                  <div className="relative">
                    {tooltip === lesson.id && (
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-2xl shadow-2xl whitespace-nowrap animate-bounce z-50">
                        Complete Previous to Unlock
                      </div>
                    )}

                    <button
                      onClick={() => handleLessonClick(lesson)}
                      className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-xl transition-all border-4 active:scale-[0.98] ${
                        isCompleted 
                          ? 'bg-[#2563eb] border-blue-100 active:bg-blue-700' 
                          : isInProgress 
                            ? 'bg-[#f0f7ff] border-[#2563eb] animate-pulse active:bg-blue-50' 
                            : 'bg-[#f0f7ff] border-blue-50 opacity-60 active:bg-blue-50'
                      }`}
                    >
                      {isCompleted ? (
                        <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className={`text-2xl font-black ${isInProgress ? 'text-[#2563eb]' : 'text-slate-300'}`}>
                          {lesson.id}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className={`mt-4 text-center max-w-[160px] px-2 transition-all ${isLocked ? 'opacity-40' : 'opacity-100'}`}>
                    <h4 className={`text-xs font-black uppercase tracking-wide leading-tight ${isInProgress ? 'text-[#2563eb]' : 'text-slate-800'}`}>
                      {lesson.title}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Learning Tools Folder */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <AnimatePresence>
          {isToolsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[-1]"
              onClick={() => setIsToolsOpen(false)}
            />
          )}
        </AnimatePresence>

        <div className="relative flex flex-col items-center">
          {/* Tool Cards */}
          <AnimatePresence>
            {isToolsOpen && (
              <div className="absolute bottom-8 right-10 flex items-center justify-center pointer-events-none">
                {[
                  { id: 'flashcards', title: 'Flashcards', icon: <Layers size={18} />, action: onSelectFlashcards, x: -160 * spreadMultiplier, y: -20 * spreadMultiplier, rotate: -12 },
                  { id: 'quiz', title: 'Quizzes', icon: <CheckSquare size={18} />, action: onSelectQuiz, x: -110 * spreadMultiplier, y: -90 * spreadMultiplier, rotate: -4 },
                  { id: 'mindmap', title: 'Mind Maps', icon: <Brain size={18} />, action: onSelectMindMap, x: -10 * spreadMultiplier, y: -130 * spreadMultiplier, rotate: 4 },
                  { id: 'formulas', title: 'Formulas', icon: <Sigma size={18} />, action: onSelectKeyFormulas, x: 80 * spreadMultiplier, y: -110 * spreadMultiplier, rotate: 12 },
                ].map((tool, i) => (
                  <motion.button
                    key={tool.id}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{ 
                      x: tool.x, 
                      y: tool.y, 
                      opacity: 1, 
                      scale: 1,
                      rotate: tool.rotate
                    }}
                    exit={{ x: 0, y: 0, opacity: 0, scale: 0.5, rotate: 0 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 250, 
                      damping: 25,
                      mass: 0.8,
                      delay: i * 0.06, // 60ms stagger
                      duration: 0.25 // 250ms fan animation
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      tool.action();
                      setIsToolsOpen(false);
                    }}
                    className="absolute w-36 p-3 bg-[#f0f7ff] rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-blue-100 flex items-center space-x-3 active:scale-95 transition-transform pointer-events-auto hover:border-blue-200 group"
                  >
                    <div className="text-[#2563eb] group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </div>
                    <span className="font-bold text-[10px] text-slate-700 uppercase tracking-wider">{tool.title}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Folder Button */}
          <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="relative w-20 h-16 z-10"
          >
            {/* Folder Tab */}
            <div className="absolute -top-2 left-0 w-7 h-4 bg-blue-900 rounded-t-md" />
            
            {/* Folder Body (Back) */}
            <div className="absolute inset-0 bg-blue-900 rounded-lg rounded-tl-none shadow-xl overflow-hidden">
              {/* Stacked Documents (Inside) */}
              <div className="absolute inset-x-2 top-2 bottom-0 flex flex-col items-center">
                <motion.div 
                  animate={{ y: isToolsOpen ? -15 : isHovered ? -6 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full h-12 bg-blue-50 rounded-sm shadow-sm border-t border-blue-100" 
                />
                <motion.div 
                  animate={{ y: isToolsOpen ? -10 : isHovered ? -3 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full h-12 bg-[#f0f7ff] rounded-sm shadow-sm border-t border-blue-50 -mt-10" 
                />
              </div>
            </div>

            {/* Folder Lid (Front) */}
            <motion.div
              animate={{ 
                rotateX: isToolsOpen ? -45 : isHovered ? -25 : 0,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }} // 200ms folder open
              style={{ transformOrigin: "bottom", perspective: "1000px" }}
              className="absolute inset-0 bg-blue-800 rounded-lg rounded-tl-none shadow-md border-t border-white/10 flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {isToolsOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} className="text-white/40" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="folder"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-0.5 bg-white/20 rounded-full"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Notification Dot */}
            {!isToolsOpen && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow-sm z-30"
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MicroLessonPathScreen;
