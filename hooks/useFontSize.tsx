'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FontSizeContextType {
  fontSize: number; // Changed from string to number
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  setFontSizeDirect: (size: number) => void; // Changed parameter type to number
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<number>(100); // Changed default to number 100

  const increaseFontSize = () => {
    setFontSize((prev) => {
      if (prev >= 200) return 200;
      // Increase by 10
      return Math.min(prev + 10, 200);
    });
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => {
      if (prev <= 50) return 50;
      // Decrease by 10
      return Math.max(prev - 10, 50);
    });
  };

  const resetFontSize = () => {
    setFontSize(100); // Reset to 100
  };

  const setFontSizeDirect = (size: number) => {
    // Clamp between 50 and 200
    const clampedSize = Math.max(50, Math.min(200, size));
    setFontSize(clampedSize);
  };

  const value = {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    setFontSizeDirect,
  };

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}
