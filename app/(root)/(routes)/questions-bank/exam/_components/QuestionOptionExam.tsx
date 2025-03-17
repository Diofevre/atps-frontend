'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface QuestionOptionExamProps {
  options: Record<string, string> | undefined;
  currentQuestionIndex: number;
  questionId: number;
  answeredQuestions: number[];
  handleAnswer: (questionId: number, userAnswer: string) => void;
  examId: number | null;
}

const QuestionOptionExam: React.FC<QuestionOptionExamProps> = ({
  options,
  questionId,
  handleAnswer,
  examId,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  // Load saved answers for this exam
  useEffect(() => {
    if (examId) {
      const storageKey = `exam_${examId}_answers`;
      const savedAnswers = localStorage.getItem(storageKey);
      if (savedAnswers) {
        setSelectedAnswers(JSON.parse(savedAnswers));
      } else {
        setSelectedAnswers({});
      }
    }
  }, [examId]);

  // Save answers to localStorage
  const saveAnswers = useCallback((answers: Record<number, string>) => {
    if (examId) {
      const storageKey = `exam_${examId}_answers`;
      localStorage.setItem(storageKey, JSON.stringify(answers));
    }
  }, [examId]);

  const handleOptionClick = (key: string) => {
    const newAnswers = {
      ...selectedAnswers,
      [questionId]: key
    };
    setSelectedAnswers(newAnswers);
    saveAnswers(newAnswers);
    handleAnswer(questionId, key);
  };

  if (!options || Object.keys(options).length === 0) {
    return <p>No options available for this question.</p>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {Object.entries(options).map(([key, value], index) => {
        const isSelected = selectedAnswers[questionId] === key;

        return (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleOptionClick(key)}
            className={`
              group relative w-full p-5 rounded-[20px] transition-all duration-300
              ${isSelected
                ? 'bg-[#EECE84]/40 border border-[#EECE84]'
                : 'hover:scale-[1.02] hover:shadow-lg cursor-pointer bg-white backdrop-blur-sm border border-[#C1E0F1] hover:border-[#C1E0F1]/80'
              }
            `}
          >
            <div className="flex items-center gap-6">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-xl text-lg font-semibold
                transition-colors duration-300
                ${isSelected
                  ? 'bg-[#EECE84]/50 border border-[#EECE84] text-black'
                  : 'bg-[#C1E0F1]/50 text-black/50 group-hover:bg-[#C1E0F1]/30'
                }
              `}>
                {key}
              </div>

              <span className="flex-1 text-left text-lg text-gray-700">
                {value}
              </span>
            </div>

            {!isSelected && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#C1E0F1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuestionOptionExam;