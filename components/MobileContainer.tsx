
import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="w-full h-full relative overflow-y-auto">
      {children}
    </div>
  );
};

export default MobileContainer;
