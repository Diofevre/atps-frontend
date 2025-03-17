'use client'

import React, { FC, useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import PaginationControl from '../../_components/PaginationControl';
import QuestionExamButton from './QuestionExamButton';
interface SidebarExamProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  onNavigateToQuestion: (index: number) => void;
  answeredQuestions: number[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onValidate: () => void;
}

const SidebarExam: FC<SidebarExamProps> = ({
  totalQuestions,
  currentQuestionIndex,
  onNavigateToQuestion,
  answeredQuestions,
  isOpen,
  onOpenChange,
  onValidate,
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isLargeHeight = useMediaQuery("(min-height: 900px)");
  const isMediumHeight = useMediaQuery("(min-height: 700px)");

  const [isValidating, setIsValidating] = useState(false);
  
  const getQuestionsPerPage = () => {
    if (isLargeHeight) return 40;
    if (isMediumHeight) return 28;
    return 20;
  };

  const questionsPerPage = getQuestionsPerPage();
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    if (isDesktop && isOpen) {
      onOpenChange(false);
    }
  }, [isDesktop, isOpen, onOpenChange]);

  useEffect(() => {
    const targetPage = Math.floor(currentQuestionIndex / questionsPerPage) + 1;
    setCurrentPage(targetPage);
  }, [currentQuestionIndex, questionsPerPage]);

  const handlePageChange = (direction: 'prev' | 'next') => {
    setCurrentPage((prevPage) => {
      if (direction === 'prev' && prevPage > 1) return prevPage - 1;
      if (direction === 'next' && prevPage < totalPages) return prevPage + 1;
      return prevPage;
    });
  };

  const renderQuestionButtons = () => {
    const start = (currentPage - 1) * questionsPerPage;
    const end = Math.min(start + questionsPerPage, totalQuestions);

    return Array.from({ length: end - start }, (_, index) => {
      const questionIndex = start + index;
      const questionNumber = questionIndex + 1;
      const isActive = questionIndex === currentQuestionIndex;
      const isAnswered = answeredQuestions.includes(questionIndex);

      return (
        <QuestionExamButton
          key={questionIndex}
          number={questionNumber}
          isActive={isActive}
          isAnswered={isAnswered}
          onClick={() => onNavigateToQuestion(questionIndex)}
        />
      );
    });
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      await onValidate();
    } finally {
      setIsValidating(false);
    }
  };

  const ActionButtons = () => (
    <div className="flex flex-row items-center justify-center gap-2 mt-4">
      <Button
        onClick={handleValidate}
        disabled={isValidating}
        className="bg-[#EECE84] text-black rounded-[12px] hover:bg-[#EECE84]/90 px-6 h-10 text-sm gap-1 flex items-center shadow-none disabled:opacity-50"
      >
        {isValidating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="inline">
          {isValidating ? 'Submitting...' : 'Submit'}
        </span>
      </Button>
    </div>
  );

  const SidebarContent = () => (
    <div>
      <div className={`
        bg-white dark:bg-gray-900/50 backdrop-blur-xl 
        border border-gray-200 dark:border-gray-800 
        rounded-[20px] p-6
        w-[280px]
        transition-all duration-200
      `}>
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="grid grid-cols-4 gap-2.5 mt-4">
          {renderQuestionButtons()}
        </div>
      </div>
      <ActionButtons />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`
        fixed top-0 right-0 h-screen bg-white/50 backdrop-blur-xl
        transition-all duration-300 ease-in-out z-50
        flex items-center justify-center
        lg:relative lg:h-auto lg:translate-x-0 lg:bg-transparent lg:backdrop-blur-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        hidden lg:flex
      `}>
        <SidebarContent />
      </div>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent side="right" className="w-full sm:max-w-[300px] p-0 flex items-center">
            <div className="w-full h-full flex items-center justify-center px-4">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default SidebarExam;