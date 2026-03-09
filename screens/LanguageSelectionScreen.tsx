
import React, { useState } from 'react';

interface LanguageSelectionScreenProps {
  onContinue: (language: string) => void;
  onBack: () => void;
}

const LANGUAGES = [
  { label: 'தமிழ்', value: 'Tamil' },
  { label: 'తెలుగు', value: 'Telugu' },
  { label: 'ಕನ್ನಡ', value: 'Kannada' },
  { label: 'മലയാളം', value: 'Malayalam' },
  { label: 'हिन्दी', value: 'Hindi' },
  { label: 'English', value: 'English' }
];

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onContinue, onBack }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-white relative animate-fade-in">
      {/* Header */}
      <div className="pt-12 px-6 pb-6">
        <button 
          onClick={onBack}
          className="mb-6 p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-slate-900">Preferred Language</h2>
        <p className="text-slate-500 mt-2 text-lg">Choose the language you are most comfortable learning in</p>
      </div>

      {/* Language List */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="space-y-3">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.value;
            return (
              <button
                key={lang.value}
                onClick={() => setSelectedLanguage(lang.value)}
                className={`w-full p-5 rounded-2xl text-left transition-all duration-200 border-2 flex items-center justify-between active:scale-[0.98] ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/5' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <span className={`text-xl font-bold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                  {lang.label}
                </span>
                {isSelected && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <button
          disabled={!selectedLanguage}
          onClick={() => selectedLanguage && onContinue(selectedLanguage)}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
            selectedLanguage 
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;
