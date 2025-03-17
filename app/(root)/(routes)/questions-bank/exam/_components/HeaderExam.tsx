'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CircleAlert, AlignJustify, Timer, GraduationCap } from 'lucide-react';
import ReportModal from '@/components/shared/ReportModal';

interface HeaderExamProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  timeSpent: string;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onSubmitReport: (report: { userId: string; categorie: string; contenu: string }) => void;
  currentQuestionId: number;
  userId: string;
  onToggleSidebar: () => void;
}

const HeaderExam: React.FC<HeaderExamProps> = ({
  currentQuestionIndex,
  totalQuestions,
  timeSpent,
  onPreviousQuestion,
  onNextQuestion,
  onSubmitReport,
  userId,
  onToggleSidebar
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Exam Session Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#EECE84]/80 to-[#EECE84]/70 px-4 py-2 rounded-lg">
              <GraduationCap className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-black/80 text-[10px] uppercase tracking-wider">Active Session</span>
                <span className="font-medium text-sm">
                  Final Examination
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-row items-center justify-center gap-4">
            <Button
              size="icon"
              onClick={onPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="p-2 rounded-[12px] bg-white hover:bg-gray-50 disabled:opacity-50 text-black shadow-sm border border-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-[12px] px-4 py-1.5">
              <span className="font-medium text-gray-900">{currentQuestionIndex + 1}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{totalQuestions}</span>
            </div>
            <Button
              size="icon"
              onClick={onNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="p-2 rounded-[12px] bg-white hover:bg-gray-50 disabled:opacity-50 text-black shadow-sm border border-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Timer */}
          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-[12px] border border-amber-200/60 bg-amber-50/50">
            <Timer className="w-4 h-4 text-amber-600" />
            <span className="text-base font-medium text-amber-900">{timeSpent}</span>
          </div>

          {/* Report Button and Sidebar Toggle */}
          <div className="flex flex-row items-center gap-3">
            <button
              className="px-4 py-2 rounded-[12px] text-sm text-red-600 border border-red-200 bg-red-50/50 flex items-center gap-2 hover:bg-red-100/50 transition-colors duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              <CircleAlert className="w-4 h-4" />
              <span className="hidden sm:block font-medium">Report Issue</span>
            </button>

            {/* Sidebar Toggle Button - Only visible on mobile */}
            <Button
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg bg-white hover:bg-gray-50 text-black shadow-sm border border-gray-200"
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

export default HeaderExam;