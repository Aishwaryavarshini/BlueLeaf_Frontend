
import React, { useState, useRef, useEffect } from 'react';
import { UserPreferences } from '../App';
import { aiService } from '../services/aiService';

interface LessonTeachingScreenProps {
  preferences: UserPreferences;
  lessonTitle: string;
  onComplete: () => void;
  onBack: () => void;
}

interface Message {
  text: string | React.ReactNode;
  sender: 'user' | 'ai';
  rawText?: string;
  feedback?: 'positive' | 'negative' | null;
  feedbackComment?: string;
  isStreaming?: boolean;
}

interface LessonContent {
  analogy: string;
  core_concept: string;
  examples: string[];
  summary: string[];
  bridge?: string[];
  interactive_challenge: string;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const VOICE_MAP: Record<string, string> = {
  'Calm & Soft': 'Puck',
  'Friendly & Cheerful': 'Kore',
  'Energetic & Encouraging': 'Kore',
  'Deep & Steady': 'Charon',
  'Calm & Reassuring': 'Fenrir',
  'Clear & Confident': 'Zephyr',
};

const LessonTeachingScreen: React.FC<LessonTeachingScreenProps> = ({ preferences, lessonTitle, onComplete, onBack }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isReading, setIsReading] = useState<number | string | null>(null);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  
  const sessionTranscriptsRef = useRef<{ user: string; ai: string }[]>([]);
  const currentTurnRef = useRef<{ user: string; ai: string }>({ user: '', ai: '' });
  const [liveUserTranscript, setLiveUserTranscript] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const isTamil = preferences.language === 'Tamil';
  const placeholderText = isTamil ? "சந்தேகத்தை கேளுங்கள்..." : "Ask your doubt here...";

  const getLanguageInstruction = (lang: string) => {
    if (lang === 'English') {
      return `For every answer, provide a simple English explanation followed by "---" and then a formal academic English explanation.`;
    }
    return `For every answer, provide a simple ${lang} explanation followed by "---" and then a formal academic English explanation.`;
  };

  const systemInstruction = `You are Blue, an AI tutor for Grade ${preferences.selectedClass}.
  Subject: ${preferences.assignedSubject || 'General'}. Lesson: "${lessonTitle}". 
  Primary Language: ${preferences.language}.
  Goal: ${preferences.specificGoal}.
  
  ${getLanguageInstruction(preferences.language)}
  
  IMPORTANT: Only answer from syllabus. If unknown, say "This topic is outside your syllabus."`;

  useEffect(() => {
    const fetchInitialContent = async () => {
      setIsLoadingContent(true);
      try {
        const content = await aiService.generateLessonContent(
          lessonTitle,
          "Current Unit",
          preferences.assignedSubject || 'General',
          preferences
        );
        setLessonContent(content);
      } catch (e) {
        console.error("Failed to load lesson content", e);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchInitialContent();
    
    const intro = isTamil 
      ? `வணக்கம்! ${lessonTitle} பாடத்தைப் படிக்கத் தயாரா? கீழே உள்ள விளக்கத்தைப் படித்துவிட்டு, ஏதேனும் சந்தேகம் இருந்தால் என்னிடம் கேளுங்கள்.`
      : `Hi! Ready to learn ${lessonTitle}? Read the guide below and ask me if you have any questions.`;
    setMessages([{ text: intro, sender: 'ai', rawText: intro }]);
  }, [preferences, lessonTitle, isTamil]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, lessonContent]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAILoading) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setChatInput('');
    setIsAILoading(true);

    try {
      const stream = await aiService.sendMessageStream(userMsg, [], systemInstruction);
      setMessages(prev => [...prev, { text: '', sender: 'ai', isStreaming: true }]);
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text || '';
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.sender === 'ai') {
            last.text = (
              <div className="space-y-4">
                {fullText.split('---').map((part, i) => (
                  <p key={i} className={i > 0 ? 'pt-4 border-t border-slate-100 italic text-slate-500' : ''}>
                    {part.trim()}
                  </p>
                ))}
              </div>
            );
            last.rawText = fullText;
          }
          return updated;
        });
      }
      
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last) last.isStreaming = false;
        return updated;
      });

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { text: "Sorry, I encountered an error. Please try again.", sender: 'ai' }]);
    } finally {
      setIsAILoading(false);
    }
  };

  const renderDualExplanation = (text: string) => {
    if (!text) return null;
    const parts = text.split('---');
    return (
      <div className="space-y-4">
        {parts.map((part, i) => (
          <p key={i} className={i > 0 ? 'pt-4 border-t border-white/20 opacity-90 italic' : ''}>
            {part.trim()}
          </p>
        ))}
      </div>
    );
  };

  const renderLightDualExplanation = (text: string) => {
    if (!text) return null;
    const parts = text.split('---');
    return (
      <div className="space-y-4">
        {parts.map((part, i) => (
          <p key={i} className={i > 0 ? 'pt-4 border-t border-slate-100 italic text-slate-500' : ''}>
            {part.trim()}
          </p>
        ))}
      </div>
    );
  };

  const handleReadAloud = async (id: number | string, textToRead: string) => {
    if (isReading === id) return;
    setIsReading(id);
    try {
      const selectedVoice = VOICE_MAP[preferences.selectedVoice] || 'Kore';
      const primaryText = (textToRead || '').split('---')[0].trim();
      if (!primaryText) {
        setIsReading(null);
        return;
      }
      
      // Use mock service
      await aiService.generateTTS(primaryText, selectedVoice);
      
      // Simulate audio playback duration
      setTimeout(() => {
        setIsReading(null);
      }, 2000);
      
    } catch (e) { 
      setIsReading(null); 
    }
  };

  const startVoiceMode = async () => {
    setIsVoiceModeActive(true);
    setLiveUserTranscript('');
    try {
      const selectedVoice = VOICE_MAP[preferences.selectedVoice] || 'Zephyr';

      const session = await aiService.connectLive({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        voice: selectedVoice,
        systemInstruction
      }, {
        onopen: () => {
          console.log("Mock voice mode opened");
        },
        onmessage: async (message: any) => {
          if (message.serverContent?.inputTranscription) {
            const text = message.serverContent.inputTranscription.text;
            currentTurnRef.current.user += text;
            setLiveUserTranscript(prev => (prev + " " + text).slice(-100));
          }
        },
        onclose: () => {
          console.log("Mock voice mode closed");
        }
      });
      
      liveSessionRef.current = session;
    } catch (e) {
      setIsVoiceModeActive(false);
    }
  };

  const endVoiceMode = () => {
    if (liveSessionRef.current) liveSessionRef.current.close();
    activeSourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    activeSourcesRef.current.clear();
    if (sessionTranscriptsRef.current.length > 0) {
      const newMessages: Message[] = [];
      sessionTranscriptsRef.current.forEach(turn => {
        if (turn.user) newMessages.push({ text: turn.user, sender: 'user' });
        if (turn.ai) newMessages.push({ 
          text: (
            <div className="space-y-4">
              {(turn.ai || '').split('---').map((part, i) => (
                <p key={i} className={i > 0 ? 'pt-4 border-t border-slate-100 italic text-slate-500' : ''}>
                  {part.trim()}
                </p>
              ))}
            </div>
          ), 
          sender: 'ai', 
          rawText: turn.ai 
        });
      });
      setMessages(prev => [...prev, ...newMessages]);
    }
    setIsVoiceModeActive(false);
  };

  return (
    <div className="h-full flex flex-col relative animate-fade-in overflow-hidden">
      <header className="bg-[#f0f7ff] px-6 pt-12 pb-6 border-b border-blue-100 sticky top-0 z-30 shadow-md">
        <div className="flex items-center">
          <button onClick={onBack} className="p-3 bg-[#f0f7ff] border-2 border-[#2563eb] text-[#2563eb] rounded-2xl active:scale-[0.98] active:bg-blue-50 transition-all mr-4 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight truncate max-w-[200px]">{lessonTitle}</h1>
            <p className="text-[9px] font-black text-[#2563eb]/60 uppercase tracking-[0.2em] mt-1">AI Guided Lesson</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 relative z-10">
        {isLoadingContent ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
            <div className="w-14 h-14 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#2563eb] font-black uppercase tracking-widest text-[10px]">Assembling Knowledge...</p>
          </div>
        ) : lessonContent ? (
          <div className="space-y-8 animate-slide-up">
            <div className="bg-[#2563eb] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><span className="text-7xl">✨</span></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">The Intuition</h3>
              <div className="text-xl font-medium leading-relaxed">
                {renderDualExplanation(lessonContent.analogy)}
              </div>
              <button 
                onClick={() => handleReadAloud('analogy', lessonContent.analogy)} 
                className={`mt-8 w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20 border border-white/20 active:scale-[0.98] active:bg-white/40 transition-all ${isReading === 'analogy' ? 'animate-pulse' : ''}`}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              </button>
            </div>

            <div className="bg-[#f0f7ff] rounded-[3rem] p-10 border-2 border-[#2563eb]/10 shadow-xl">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Core Concept</h3>
              <div className="text-slate-800 font-medium leading-relaxed text-lg">
                {renderLightDualExplanation(lessonContent.core_concept)}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] ml-4 drop-shadow-md">Practical Examples</h3>
              <div className="grid grid-cols-1 gap-6">
                {lessonContent.examples.map((ex, i) => (
                  <div key={i} className="bg-[#f0f7ff] border-2 border-[#2563eb]/10 p-8 rounded-[2.5rem] text-slate-700 shadow-sm">
                    <span className="text-[#2563eb] font-black uppercase tracking-widest text-[10px] block mb-4">Example {i+1}</span> 
                    <div className="text-base font-bold leading-relaxed">{renderLightDualExplanation(ex)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 rounded-[3rem] p-10 border-2 border-green-100 shadow-sm">
              <h3 className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] mb-6">Key Takeaways</h3>
              <ul className="space-y-5">
                {lessonContent.summary.map((point, i) => (
                  <li key={i} className="flex items-start text-green-900 text-base font-bold">
                    <span className="mr-4 text-xl">✅</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 rounded-[3rem] p-10 border-2 border-amber-100 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#f0f7ff] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100 text-3xl">💡</div>
              <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-4">Reflect & Respond</h3>
              <p className="text-slate-800 font-bold text-lg mb-6 leading-tight">{lessonContent.interactive_challenge}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-black">Type your answer below</p>
            </div>
          </div>
        ) : null}

        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
              <div className={`relative max-w-[85%] p-8 rounded-[2.5rem] shadow-lg leading-relaxed text-base ${
                msg.sender === 'user' ? 'bg-[#f0f7ff] border-2 border-[#2563eb] text-[#2563eb] rounded-tr-none font-bold' : 'bg-[#f0f7ff] text-slate-700 rounded-tl-none border-2 border-blue-50'
              }`}>
                {msg.text}
                {msg.sender === 'ai' && !msg.isStreaming && (
                  <button 
                    onClick={() => handleReadAloud(i, msg.rawText || '')} 
                    className="absolute bottom-4 right-6 text-[#2563eb]/20 active:text-[#2563eb] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          {isAILoading && !messages[messages.length-1]?.isStreaming && (
            <div className="flex justify-start animate-fade-in pl-4">
               <div className="bg-[#f0f7ff] p-6 rounded-[2.5rem] border-2 border-blue-50 flex space-x-2 items-center shadow-sm">
                 <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce delay-200"></div>
               </div>
            </div>
          )}
        </div>
        <div ref={chatEndRef} className="pb-10" />
      </div>

      <div className="p-6 bg-[#f0f7ff] border-t border-blue-100 pb-10 sticky bottom-0 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="flex items-center space-x-4">
          <button 
            onClick={startVoiceMode} 
            className="w-14 h-14 bg-[#f0f7ff] border-2 border-[#2563eb] text-[#2563eb] rounded-2xl flex items-center justify-center active:scale-[0.98] active:bg-blue-50 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>
          </button>
          <div className="relative flex-1">
            <input 
              type="text" 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
              placeholder={placeholderText} 
              className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-[1.75rem] py-4 pl-6 pr-14 text-base focus:border-[#2563eb] focus:bg-[#f0f7ff] outline-none transition-all placeholder:text-slate-400 font-bold" 
            />
            <button 
              onClick={handleSendMessage} 
              className="absolute right-2 top-2 w-11 h-11 bg-[#2563eb] text-white rounded-xl flex items-center justify-center active:scale-[0.98] active:bg-blue-700 transition-all shadow-md"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {isVoiceModeActive && (
        <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-between p-10 text-white animate-fade-in overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#2563eb] rounded-full blur-[140px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-700 rounded-full blur-[140px] animate-pulse delay-700"></div>
          </div>
          <div className="pt-16 text-center relative z-10">
            <div className="inline-flex items-center space-x-3 bg-white/10 border border-white/20 px-6 py-2 rounded-full mb-10 animate-pulse">
               <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
               <span className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-100">Live Interaction</span>
            </div>
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">Listening...</h2>
            <p className="text-blue-200 font-bold italic text-lg opacity-80">"{liveUserTranscript || 'Speak your doubts clearly'}..."</p>
          </div>
          <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center shadow-[0_0_80px_rgba(37,99,235,0.4)] relative z-20 border-4 border-blue-100 active:scale-[0.98] transition-all">
            <svg viewBox="0 0 24 24" className="w-16 h-16 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
          </div>
          <button 
            onClick={endVoiceMode} 
            className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-widest rounded-[2.5rem] shadow-2xl active:scale-[0.98] active:bg-red-700 transition-all text-sm mb-6"
          >
            End Call
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonTeachingScreen;
