'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface QuestionButtonProps {
  number: number;
  questionId: number;
  isActive: boolean;
  isAnswered: boolean;
  isCorrect?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const QuestionButton: React.FC<QuestionButtonProps> = ({
  number,
  isActive,
  isAnswered,
  isCorrect,
  onClick,
  disabled
}) => {
  const statusClass = (() => {
    if (isAnswered) {
      return isCorrect
        ? "bg-emerald-200/20 border border-emerald-500 text-black shadow-emerald-200"
        : "bg-rose-200/50 border border-rose-500 text-black shadow-rose-200";
    }
    if (isActive) {
      return "bg-[#EECE84]/20 border border-[#EECE84] text-black/90 shadow-lg";
    }
    return "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#EECE84] dark:hover:border-[#EECE84]";
  })();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-[56px] h-10 rounded-lg font-medium transition-all duration-200",
        "flex items-center justify-center",
        "hover:scale-105 active:scale-95",
        "disabled:transform-none disabled:cursor-not-allowed",
        statusClass,
        disabled && "opacity-70"
      )}
    >
      {number}
    </button>
  );
};

export default QuestionButton;