'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CircleAlert, AlignJustify } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReportModal from '@/components/shared/ReportModal';

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
  onToggleSidebar
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${hours} : ${minutes} : ${seconds}`;
  };

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

          {/* Navigation */}
          <div className="flex flex-row items-center justify-center gap-4">
            <Button
              size="icon"
              onClick={onPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="p-2 rounded-[12px] bg-white hover:bg-white/80 disabled:opacity-50 text-black shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-medium">
              {currentQuestionIndex + 1} / {totalQuestions}
            </span>
            <Button
              size="icon"
              onClick={onNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="p-2 rounded-[12px] bg-white hover:bg-white/80 disabled:opacity-50 text-black shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Timer */}
          <div className="text-xl font-light hidden sm:block">
            {formatTime(timeSpent)}
          </div>

          {/* Report Button and Sidebar Toggle */}
          <div className="flex flex-row items-center gap-1">
            <button
              className="px-4 py-2 rounded-[12px] text-sm text-red-500 border border-red-100 flex items-center gap-1 hover:bg-red-50 transition-colors duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              <CircleAlert className="w-4 h-4" />
              <span className="hidden sm:block">Report</span>
            </button>

            {/* Sidebar Toggle Button - Only visible on mobile */}
            <Button
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-full bg-white hover:bg-white/80 text-black shadow-sm"
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