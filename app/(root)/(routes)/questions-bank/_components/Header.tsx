'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CircleAlert, AlignJustify, Code, Type, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReportModal from '@/components/shared/ReportModal';
import { useFontSize } from '@/hooks/useFontSize';

interface HeaderStateProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  timeSpent: number;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onPinQuestion: (questionId: number, color: string) => void;
  onSubmitReport: (report: { userId: string; categorie: string; contenu: string }) => void;
  pinnedQuestions: Record<number, string[]>;
  currentQuestionId: number;
  userId: string;
  onToggleSidebar: () => void;
  isDevMode: boolean;
  onToggleDevMode: () => void;
}

const HeaderState: React.FC<HeaderStateProps> = ({
  currentQuestionIndex,
  totalQuestions,
  timeSpent,
  onPreviousQuestion,
  onNextQuestion,
  onPinQuestion,
  onSubmitReport,
  pinnedQuestions,
  currentQuestionId,
  userId,
  onToggleSidebar,
  isDevMode,
  onToggleDevMode
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isFontSizeSliderOpen, setIsFontSizeSliderOpen] = React.useState(false);
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize, setFontSizeDirect } = useFontSize();

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${hours} : ${minutes} : ${seconds}`;
  };

  // Update CSS variable when fontSize changes
  React.useEffect(() => {
    document.documentElement.style.setProperty('--quiz-font-size', `${fontSize}%`);
  }, [fontSize]);

  // Close font size slider when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFontSizeSliderOpen) {
        const target = event.target as Element;
        if (!target.closest('.font-size-control')) {
          setIsFontSizeSliderOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFontSizeSliderOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Pin Colors */}
          <div className="flex items-center gap-1">
            {['red', 'orange', 'green'].map((color) => (
              <div
                key={color}
                className={cn(
                  'w-5 h-5 border-2 rounded-full cursor-pointer transition-all duration-300',
                  {
                    'border-red-600 bg-red-600': color === 'red' && pinnedQuestions[currentQuestionId]?.includes('red'),
                    'border-orange-600 bg-orange-600': color === 'orange' && pinnedQuestions[currentQuestionId]?.includes('orange'),
                    'border-green-600 bg-green-600': color === 'green' && pinnedQuestions[currentQuestionId]?.includes('green'),
                    'bg-transparent': !pinnedQuestions[currentQuestionId]?.includes(color),
                  },
                  {
                    'border-red-600': color === 'red',
                    'border-orange-600': color === 'orange',
                    'border-green-600': color === 'green',
                  }
                )}
                onClick={() => onPinQuestion(currentQuestionId, color)}
              />
            ))}
          </div>

          {/* Font Size Control - Apple Books Style */}
          <div className="relative font-size-control">
            <button
              onClick={() => setIsFontSizeSliderOpen(!isFontSizeSliderOpen)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-200 hover:scale-105",
                                  fontSize !== 100 
                  ? "bg-[#EECE84] border-[#EECE84] shadow-md" 
                  : isFontSizeSliderOpen 
                    ? "bg-[#EECE84]/20 border-[#EECE84] shadow-md" 
                    : "bg-white/90 dark:bg-card/90 border-[#C1E0F1] dark:border-border shadow-sm hover:bg-white dark:hover:bg-card hover:border-[#EECE84]/50"
              )}
              title="Ajuster la taille de police"
            >
              <div className="flex flex-col items-center justify-center gap-0">
                <span className={cn(
                  "text-lg font-bold leading-none",
                  fontSize !== 100 ? "text-white" : "text-gray-800 dark:text-white"
                )}>A</span>
                <span className={cn(
                  "text-xs font-bold leading-none",
                  fontSize !== 100 ? "text-white" : "text-gray-600 dark:text-text-secondary"
                )}>A</span>
              </div>
            </button>

            {/* Font Size Slider - Appears on click */}
            {isFontSizeSliderOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl border border-[#EECE84]/30 dark:border-border shadow-xl p-5 z-50 min-w-[240px] animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="flex flex-col items-center gap-4">
                  {/* Font Size Display */}
                  <div className="text-sm font-semibold text-gray-700 dark:text-white bg-[#EECE84]/10 dark:bg-[#EECE84]/20 px-3 py-1.5 rounded-lg">
                    Taille: {fontSize}%
                  </div>
                  
                  {/* Slider */}
                  <div className="w-full px-2">
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="10"
                      value={fontSize}
                      onChange={(e) => {
                        const newSize = parseInt(e.target.value);
                        setFontSizeDirect(newSize);
                      }}
                      className="w-full h-3 bg-gradient-to-r from-[#C1E0F1] to-[#EECE84] rounded-full appearance-none cursor-pointer slider-custom"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-text-secondary mt-1">
                      <span>50%</span>
                      <span>200%</span>
                    </div>
                  </div>
                  
                  {/* Quick buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decreaseFontSize}
                      disabled={fontSize <= 50}
                      className="px-4 py-2 text-sm bg-[#C1E0F1]/30 hover:bg-[#C1E0F1]/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium"
                    >
                      -
                    </button>
                    <button
                      onClick={resetFontSize}
                      className="px-4 py-2 text-sm bg-[#EECE84]/30 hover:bg-[#EECE84]/50 text-gray-800 dark:text-gray-900 rounded-lg transition-all duration-200 font-medium"
                    >
                      Reset
                    </button>
                    <button
                      onClick={increaseFontSize}
                      disabled={fontSize >= 200}
                      className="px-4 py-2 text-sm bg-[#C1E0F1]/30 hover:bg-[#C1E0F1]/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex flex-row items-center justify-center gap-4">
            <Button
              size="icon"
              onClick={onPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="p-2 rounded-[12px] bg-white dark:bg-card hover:bg-white/80 dark:hover:bg-card/80 disabled:opacity-50 text-black dark:text-white shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-medium text-foreground">
              {currentQuestionIndex + 1} / {totalQuestions}
            </span>
            <Button
              size="icon"
              onClick={onNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="p-2 rounded-[12px] bg-white dark:bg-card hover:bg-white/80 dark:hover:bg-card/80 disabled:opacity-50 text-black dark:text-white shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Timer */}
          <div className="text-xl font-light hidden sm:block">
            {formatTime(timeSpent)}
          </div>

          {/* Report Button, Dev Mode Button and Sidebar Toggle */}
          <div className="flex flex-row items-center gap-1">
            <button
              className="px-4 py-2 rounded-[12px] text-sm text-red-500 border border-red-100 flex items-center gap-1 hover:bg-red-50 transition-colors duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              <CircleAlert className="w-4 h-4" />
              <span className="hidden sm:block">Report</span>
            </button>

            {/* Developer Mode Button */}
            <button
              className={cn(
                "px-4 py-2 rounded-[12px] text-sm border flex items-center gap-1 transition-colors duration-300",
                isDevMode 
                  ? "text-white bg-red-600 border-red-600 hover:bg-red-700" 
                  : "text-red-500 border-red-100 hover:bg-red-50"
              )}
              onClick={onToggleDevMode}
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:block">Dev Mode</span>
            </button>

            {/* Sidebar Toggle Button - Only visible on mobile */}
            <Button
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-full bg-white dark:bg-card hover:bg-white/80 dark:hover:bg-card/80 text-black dark:text-white shadow-sm"
            >
              <AlignJustify className="w-5 h-5" />
            </Button>

            <ReportModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={onSubmitReport}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderState;