'use client';

import React from 'react';

interface RolledNewspaperIconProps {
  className?: string;
}

const RolledNewspaperIcon: React.FC<RolledNewspaperIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Scroll/rolled paper - outer layers */}
      <path d="M3 6 Q3 3 6 3 L14 3 Q17 3 17 6 Q17 3 20 3" strokeWidth="1.5" fill="none" />
      
      {/* Main scroll body */}
      <path d="M4 7 Q4 4 6 4 L14 4 Q16 4 16 7 L16 15 Q16 18 14 18 L6 18 Q4 18 4 15 Z" strokeWidth="1.5" fill="none" />
      
      {/* Text block (image/title) */}
      <rect x="6" y="6.5" width="6" height="4" strokeWidth="1.2" />
      
      {/* Text lines */}
      <line x1="12.5" y1="7.5" x2="14" y2="7.5" strokeWidth="1" />
      <line x1="12.5" y1="8.5" x2="14" y2="8.5" strokeWidth="1" />
      <line x1="12.5" y1="9.5" x2="14" y2="9.5" strokeWidth="1" />
      
      {/* Vertical text columns */}
      <line x1="7" y1="11" x2="7" y2="14" strokeWidth="0.8" />
      <line x1="9" y1="11" x2="9" y2="14" strokeWidth="0.8" />
      <line x1="11" y1="11" x2="11" y2="14" strokeWidth="0.8" />
      <line x1="13" y1="11" x2="13" y2="14" strokeWidth="0.8" />
    </svg>
  );
};

export default RolledNewspaperIcon;
