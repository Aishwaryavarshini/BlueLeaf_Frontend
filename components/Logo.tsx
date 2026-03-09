
import React from 'react';

interface LogoProps {
  /** Size variant for the logo container */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Optional custom image source */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Custom CSS classes */
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  src = 'https://i.postimg.cc/13qKn62Y/file-000000007550720b9d8fcbcca1006fbe.png', 
  alt = 'BlueLeaf Logo', 
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-12 h-12',
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}>
      {/* Soft pulse glow behind container */}
      <div className="absolute inset-0 bg-blue-400/20 rounded-[3rem] blur-2xl animate-pulse"></div>
      
      {/* Logo Container: Rounded Square */}
      <div className="w-full h-full bg-white rounded-[3rem] shadow-2xl p-6 flex items-center justify-center animate-breathe relative z-10 overflow-hidden">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain"
        />
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Logo;
