
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mic, 
  Keyboard, 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  RotateCw,
  Send,
  Check
} from 'lucide-react';
import { UserPreferences } from '../App';
import DashboardHeader from '../components/DashboardHeader';
import { aiService } from '../services/aiService';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface Attempt {
  cardId: string;
  mode: 'speak' | 'type' | 'self';
  status: 'green' | 'yellow' | 'red';
  timeSpent: number;
  timestamp: number;
}

interface FlashcardsScreenProps {
  preferences: UserPreferences;
  unitName: string;
  onBack: () => void;
}

type ResponseMode = 'choice' | 'speak' | 'type' | 'self';

const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ preferences, unitName, onBack }) => {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deckMode, setDeckMode] = useState<'speak' | 'type' | 'self' | null>(null);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [responseMode, setResponseMode] = useState<ResponseMode | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [isDone, setIsDone] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      try {
        const cards = await aiService.generateFlashcards(unitName, preferences);
        setDeck(cards);
        
        if (preferences.preferredFlashcardMode === 'ask_every_time') {
          setShowModeSelection(true);
        } else {
          setDeckMode(preferences.preferredFlashcardMode as any);
          setShowModeSelection(false);
        }
        
        setStartTime(Date.now());
      } catch (e) {
        console.error("Failed to load flashcards", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCards();
  }, [unitName, preferences]);

  const currentCard = deck[currentIndex];

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setResponseMode(deckMode);
    } else {
      setIsFlipped(false);
      setResponseMode(null);
      setAiResult(null);
      setUserAnswer('');
    }
  };

  const logAttempt = (status: 'green' | 'yellow' | 'red', mode: 'speak' | 'type' | 'self') => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    const newAttempt: Attempt = {
      cardId: currentCard.id,
      mode,
      status,
      timeSpent,
      timestamp: endTime
    };
    setAttempts(prev => [...prev, newAttempt]);
    setStartTime(Date.now()); // Reset for next card
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setResponseMode(null);
      setAiResult(null);
      setUserAnswer('');
      setCurrentIndex(prev => prev + 1);
      setStartTime(Date.now());
    } else {
      setIsDone(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setResponseMode(null);
      setAiResult(null);
      setUserAnswer('');
      setCurrentIndex(prev => prev - 1);
      setStartTime(Date.now());
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  const handleEvaluate = async (answer: string, mode: 'speak' | 'type') => {
    setIsProcessing(true);
    try {
      const result = await aiService.evaluateFlashcardAnswer(
        currentCard.front,
        currentCard.back,
        answer,
        preferences
      );
      setAiResult(result);
      logAttempt(result.status, mode);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelfAssess = (status: 'green' | 'yellow' | 'red') => {
    logAttempt(status, 'self');
    handleNext();
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate voice recording for demo
      setTimeout(() => {
        setIsRecording(false);
        const mockTranscript = "I think it's about how variables represent unknown values in equations.";
        setUserAnswer(mockTranscript);
        handleEvaluate(mockTranscript, 'speak');
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border-4 border-white/20 border-t-white rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl">🎴</span>
            </div>
          </div>
        </div>
        <h2 className="mt-12 text-xl font-black uppercase tracking-[0.3em] animate-pulse">Preparing Deck</h2>
        <p className="mt-4 text-white/60 text-[10px] font-black uppercase tracking-widest">AI is crafting your flashcards...</p>
      </div>
    );
  }

  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />
        <DashboardHeader preferences={preferences} title="Flashcards" />
        
        <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 pb-12">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 border-2 border-white"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 shadow-sm">
                <span className="text-4xl">🎴</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-3">
                How would you like to answer these flashcards?
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                This mode will apply to all flashcards in this deck.
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => { setDeckMode('speak'); setShowModeSelection(false); }}
                className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 p-6 rounded-[2rem] border-2 border-blue-100 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Mic size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-black text-slate-800 uppercase tracking-wide">🎙️ Speak Answers</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Voice Recognition</span>
                  </div>
                </div>
                <ArrowRight size={20} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => { setDeckMode('type'); setShowModeSelection(false); }}
                className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-6 rounded-[2rem] border-2 border-slate-100 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-800/20">
                    <Keyboard size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-black text-slate-800 uppercase tracking-wide">⌨️ Type Answers</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Text Input</span>
                  </div>
                </div>
                <ArrowRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => { setDeckMode('self'); setShowModeSelection(false); }}
                className="w-full flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 p-6 rounded-[2rem] border-2 border-emerald-100 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                    <Brain size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-black text-slate-800 uppercase tracking-wide">🧠 Self-Assess Only</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quick Check</span>
                  </div>
                </div>
                <ArrowRight size={20} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <button 
              onClick={onBack}
              className="w-full mt-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-600 transition-colors"
            >
              Cancel & Exit
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-6 text-white">
        <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-8">
          <span className="text-4xl">📭</span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-widest mb-4">No Cards Found</h2>
        <p className="text-white/60 text-center max-w-xs mb-8">We couldn't generate flashcards for this topic. Please try again.</p>
        <button 
          onClick={onBack}
          className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isDone) {
    const totalTime = attempts.reduce((acc, curr) => acc + curr.timeSpent, 0);
    const greenCount = attempts.filter(a => a.status === 'green').length;
    
    return (
      <div className="h-screen flex flex-col items-center justify-center p-10 bg-white animate-fade-in text-center">
        <div className="w-28 h-28 bg-blue-50 rounded-[3rem] flex items-center justify-center mb-10 relative border-2 border-blue-100 shadow-xl">
          <div className="absolute inset-0 bg-blue-100 rounded-[3rem] animate-ping opacity-20 scale-125"></div>
          <span className="text-5xl">🌟</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Deck Finished</h2>
        <p className="text-slate-400 mb-10 max-w-xs mx-auto font-bold uppercase tracking-widest text-[10px] leading-relaxed">
          Awesome work! You've reviewed all cards for {unitName}.
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <span className="block text-2xl font-black text-blue-600 mb-1">{greenCount}</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mastered</span>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <span className="block text-2xl font-black text-blue-600 mb-1">{Math.floor(totalTime / 60)}m {totalTime % 60}s</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Time Spent</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full py-6 bg-[#2563eb] text-white font-black uppercase tracking-[0.25em] text-xs rounded-3xl shadow-xl active:scale-[0.98] active:bg-blue-700 transition-all"
        >
          Return to Path
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative bg-slate-50 overflow-hidden font-sans">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />
      
      <DashboardHeader preferences={preferences} title="Flashcards" />

      {/* Progress Bar & Counter */}
      <div className="relative z-10 px-6 py-4 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft size={14} className="mr-2" strokeWidth={3} />
            <span>Exit</span>
          </button>
          <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
            Card {currentIndex + 1} of {deck.length}
          </div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
          />
        </div>
      </div>

      {/* Main Card Area */}
      <div 
        className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 pb-12"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-full max-w-sm aspect-[3/4] relative perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0, rotateY: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="w-full h-full relative"
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="w-full h-full relative cursor-pointer"
                onClick={handleFlip}
              >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-[3rem] shadow-2xl border-2 border-white flex flex-col items-center justify-center p-10 backface-hidden">
                  <span className="text-[10px] font-black text-blue-600/30 uppercase tracking-[0.4em] mb-8">Concept</span>
                  <h3 className="text-2xl font-black text-slate-800 text-center leading-tight">
                    {currentCard.front}
                  </h3>
                  <div className="mt-12 flex flex-col items-center space-y-2 opacity-20">
                    <RotateCw size={24} className="text-blue-600" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Tap to flip</span>
                  </div>
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 w-full h-full bg-blue-50 rounded-[3rem] shadow-2xl border-4 border-white flex flex-col items-center justify-center p-10 backface-hidden"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <span className="text-[10px] font-black text-blue-600/30 uppercase tracking-[0.4em] mb-6">Explanation</span>
                  <div className="text-center w-full overflow-y-auto max-h-full">
                    {(currentCard?.back || '').split('---').map((part, i) => (
                      <p key={i} className={`text-lg font-bold leading-relaxed ${i > 0 ? 'mt-6 pt-6 border-t-2 border-white text-blue-600 italic' : 'text-slate-800'}`}>
                        {part.trim()}
                      </p>
                    ))}
                  </div>
                  <div className="mt-8 bg-blue-600/10 px-4 py-1.5 rounded-full">
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Answer Revealed</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 -right-4 flex justify-between pointer-events-none">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              disabled={currentIndex === 0}
              className={`w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 active:scale-90 transition-all pointer-events-auto ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
            >
              <ArrowLeft size={20} strokeWidth={3} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              disabled={currentIndex === deck.length - 1}
              className={`w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 active:scale-90 transition-all pointer-events-auto ${currentIndex === deck.length - 1 ? 'opacity-0' : 'opacity-100'}`}
            >
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Interaction Panel */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-30"
          >
            {responseMode === 'speak' && (
              <div className="flex flex-col items-center space-y-8 py-4">
                <div className="text-center">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Speak your explanation</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No time pressure, just talk</p>
                </div>
                
                <div className="relative">
                  <AnimatePresence>
                    {isRecording && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.2 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 bg-blue-600 rounded-full"
                      />
                    )}
                  </AnimatePresence>
                  <button 
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all relative z-10 ${isRecording ? 'bg-red-500 scale-90' : 'bg-blue-600 active:scale-95'}`}
                  >
                    {isProcessing ? (
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Mic size={32} className="text-white" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {responseMode === 'type' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Type your explanation</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Be as detailed as you like</p>
                </div>
                <div className="relative">
                  <textarea 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Start typing here..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all min-h-[120px] resize-none"
                  />
                  <button 
                    onClick={() => handleEvaluate(userAnswer, 'type')}
                    disabled={isProcessing || !userAnswer.trim()}
                    className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-xl shadow-lg active:scale-90 disabled:opacity-50 transition-all"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {responseMode === 'self' && (
              <div className="space-y-8 py-4">
                <div className="text-center">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Self-Assessment</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">How confident are you with this concept?</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleSelfAssess('green')}
                    className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100 active:scale-95 transition-all"
                  >
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/20">
                      <Check size={24} strokeWidth={3} />
                    </div>
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Confident</span>
                  </button>
                  <button 
                    onClick={() => handleSelfAssess('yellow')}
                    className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-100 active:scale-95 transition-all"
                  >
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <AlertCircle size={24} strokeWidth={3} />
                    </div>
                    <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Somewhat</span>
                  </button>
                  <button 
                    onClick={() => handleSelfAssess('red')}
                    className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-rose-50 border-2 border-rose-100 active:scale-95 transition-all"
                  >
                    <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <XCircle size={24} strokeWidth={3} />
                    </div>
                    <span className="text-[9px] font-black text-rose-700 uppercase tracking-widest">Not Clear</span>
                  </button>
                </div>
              </div>
            )}

            {/* AI Result Display */}
            {aiResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 rounded-3xl border-2 border-slate-50 bg-slate-50/50"
              >
                <div className="flex items-center space-x-3 mb-4">
                  {aiResult.status === 'green' && <CheckCircle2 className="text-emerald-500" size={24} />}
                  {aiResult.status === 'yellow' && <AlertCircle className="text-amber-500" size={24} />}
                  {aiResult.status === 'red' && <XCircle className="text-rose-500" size={24} />}
                  <span className={`text-xs font-black uppercase tracking-widest ${
                    aiResult.status === 'green' ? 'text-emerald-600' : 
                    aiResult.status === 'yellow' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {aiResult.badgeText}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed mb-4">
                  {aiResult.feedback}
                </p>
                {aiResult.missedIdeas && aiResult.missedIdeas.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Key points to remember:</h5>
                    <div className="flex flex-wrap gap-2">
                      {aiResult.missedIdeas.map((idea: string, i: number) => (
                        <span key={i} className="bg-white px-3 py-1 rounded-full text-[9px] font-bold text-slate-600 border border-slate-100 shadow-sm">
                          {idea}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleNext}
                  className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                  Next Card
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default FlashcardsScreen;
