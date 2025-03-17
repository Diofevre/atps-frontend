import React, { FC, useEffect, useState } from 'react';
import QuestionButton from './QuestionButton';
import PaginationControl from './PaginationControl';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Send } from 'lucide-react';

interface SidebarCardProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  questions: { id: number }[];
  onNavigateToQuestion: (index: number) => void;
  answeredQuestions: {
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
  }[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onValidate: () => void;
  onSave: () => void;
}

const SidebarCard: FC<SidebarCardProps> = ({
  totalQuestions,
  currentQuestionIndex,
  questions,
  onNavigateToQuestion,
  answeredQuestions,
  isOpen,
  onOpenChange,
  onValidate,
  onSave
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isLargeHeight = useMediaQuery("(min-height: 900px)");
  const isMediumHeight = useMediaQuery("(min-height: 700px)");

  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
      const currentQuestionId = questions[questionIndex]?.id;
      const answered = answeredQuestions.find(
        (q) => q.questionId === currentQuestionId
      );

      return (
        <QuestionButton
          key={questionIndex}
          number={questionNumber}
          questionId={currentQuestionId}
          isActive={isActive}
          isAnswered={!!answered}
          isCorrect={answered?.isCorrect}
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const ActionButtons = () => (
    <div className="flex flex-row items-center justify-center gap-2 mt-4">
      <Button
        onClick={handleValidate}
        disabled={isValidating}
        className="bg-[#EECE84] text-black rounded-[12px] hover:bg-[#EECE84]/90 border border-[#EECE84] px-6 h-10 text-sm gap-1 flex items-center shadow-none disabled:opacity-50"
      >
        {isValidating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="inline">
          {isValidating ? 'Validating...' : 'Validate'}
        </span>
      </Button>
      <Button 
        onClick={handleSave}
        disabled={isSaving}
        className="bg-white text-black rounded-[12px] hover:bg-gray-50 px-6 h-10 text-sm gap-1 flex items-center border shadow-none disabled:opacity-50"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        <span className="inline">
          {isSaving ? 'Saving...' : 'Save'}
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

export default SidebarCard;