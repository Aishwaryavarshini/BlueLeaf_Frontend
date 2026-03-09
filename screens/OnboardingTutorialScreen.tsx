
import React, { useState } from 'react';

interface OnboardingTutorialScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    headline: "No pressure. No rankings.",
    subtext: "Learn at your own pace without competition or stress.",
    icon: (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse opacity-50 scale-110"></div>
        <div className="absolute inset-4 bg-blue-100 rounded-full opacity-60 scale-105"></div>
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-blue-500 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
    )
  },
  {
    id: 2,
    headline: "Learn exactly what your syllabus needs.",
    subtext: "Lessons are structured to match your class and syllabus.",
    icon: (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute inset-0 bg-green-50 rounded-full animate-pulse opacity-50 scale-110"></div>
        <div className="absolute inset-4 bg-green-100 rounded-full opacity-60 scale-105"></div>
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-green-500 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>
    )
  },
  {
    id: 3,
    headline: "Help is always available.",
    subtext: "Ask doubts anytime and get clear explanations with AI support.",
    icon: (
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute inset-0 bg-purple-50 rounded-full animate-pulse opacity-50 scale-110"></div>
        <div className="absolute inset-4 bg-purple-100 rounded-full opacity-60 scale-105"></div>
        <svg viewBox="0 0 24 24" className="w-24 h-24 text-purple-500 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 11h.01M12 7h.01M12 15h.01" />
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z" />
        </svg>
      </div>
    )
  }
];

const OnboardingTutorialScreen: React.FC<OnboardingTutorialScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Touch handling for swiping
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  return (
    <div 
      className="h-full flex flex-col bg-white relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background blobs for aesthetic */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-slate-50 rounded-full blur-3xl opacity-50"></div>

      {/* Slider Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 ease-out transform ${
                index === currentSlide 
                  ? 'opacity-100 translate-x-0' 
                  : index < currentSlide 
                    ? 'opacity-0 -translate-x-full' 
                    : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="mb-12">
                {slide.icon}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 text-center leading-tight mb-4">
                {slide.headline}
              </h2>
              <p className="text-lg text-slate-500 text-center leading-relaxed max-w-[280px]">
                {slide.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-8 relative z-20 flex flex-col items-center">
        {/* Pagination Dots */}
        <div className="flex space-x-2 mb-8">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* CTA Button - Only on last slide */}
        <div className="w-full h-16">
          {currentSlide === slides.length - 1 ? (
            <button
              onClick={onComplete}
              className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all animate-slide-up"
            >
              Continue to Learning
            </button>
          ) : (
            <button
              onClick={nextSlide}
              className="w-full py-4 bg-slate-50 text-slate-400 font-bold text-lg rounded-2xl border border-slate-100 active:scale-95 transition-all"
            >
              Swipe to learn more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorialScreen;
