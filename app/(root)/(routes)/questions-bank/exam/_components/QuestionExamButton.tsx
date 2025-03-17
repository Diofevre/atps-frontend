'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface QuestionExamButtonProps {
  number: number;
  isActive: boolean;
  isAnswered: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const QuestionExamButton: React.FC<QuestionExamButtonProps> = ({
  number,
  isActive,
  isAnswered,
  onClick,
  disabled
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-[56px] h-10 rounded-lg font-medium transition-all duration-200",
        "flex items-center justify-center",
        "hover:scale-105 active:scale-95",
        "disabled:transform-none disabled:cursor-not-allowed",
        isActive && !isAnswered && "bg-[#EECE84]/20 border border-[#EECE84] text-black/90 shadow-lg",
        isAnswered && "bg-[#EECE84]/20 border border-[#EECE84] text-black/90",
        !isActive && !isAnswered && "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#EECE84] dark:hover:border-[#EECE84]",
        disabled && "opacity-70"
      )}
    >
      {number}
    </button>
  );
};

export default QuestionExamButton;