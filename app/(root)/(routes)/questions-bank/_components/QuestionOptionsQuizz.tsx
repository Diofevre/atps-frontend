/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lock, Star, XCircle, ZoomIn, ZoomOut } from 'lucide-react';

interface QuestionOptionsProps {
  options: Record<string, string>;
  currentQuestionIndex: number;
  questionId: number;
  answeredQuestions: { 
    questionId: number; 
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
  }[];
  handleAnswer: (questionId: number, userAnswer: string) => void;
  currentQuestion: {
    answer: string;
    question_images: string | null;
    quality_score: string | null | undefined;
  };
}

const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  options,
  answeredQuestions,
  questionId,
  handleAnswer,
  currentQuestion,
}) => {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [scale, setScale] = useState(1);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Enable body scrolling when modal is open
  useEffect(() => {
    if (isImageEnlarged) {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isImageEnlarged]);

  // Center the image when scale changes
  useEffect(() => {
    if (modalContentRef.current && isImageEnlarged) {
      // Center the scroll position
      const container = modalContentRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      container.scrollLeft = (scrollWidth - clientWidth) / 2;
      container.scrollTop = (scrollHeight - clientHeight) / 2;
    }
  }, [scale, isImageEnlarged]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const isAnswered = (key: string) => {
    const answer = answeredQuestions.find(q => q.questionId === questionId);
    if (!answer) return null;
    
    const isSelected = answer.userAnswer === key;
    const isCorrect = key === currentQuestion.answer;
    
    // Show both the user's incorrect answer and the correct answer
    if (answer.userAnswer !== currentQuestion.answer) {
      if (isSelected) return { status: 'incorrect', showIcon: true, isCorrect: false };
      if (isCorrect) return { status: 'correct', showIcon: true, isCorrect: true };
      return { status: 'neutral', showIcon: false, isCorrect: false };
    }
    
    return {
      status: isSelected ? (isCorrect ? 'correct' : 'incorrect') : 'neutral',
      showIcon: isSelected,
      isCorrect: isCorrect && isSelected
    };
  };

  // Check if this question has been answered
  const questionAnswered = answeredQuestions.some(q => q.questionId === questionId);

  const renderQualityStars = (score: string | null | undefined) => {
    if (!score) {
      return (
        <div className="flex items-center gap-1 bg-white backdrop-blur-sm px-3 py-1.5 rounded-[12px] border border-white">
          <span className="text-sm font-medium text-gray-700 mr-1">Quality:</span>
          <span>Not available</span>
        </div>
      );
    }

    const parts = score.split(' of ');

    if (parts.length !== 2) {
      console.warn(`Unexpected quality score format: ${score}`);
      return (
        <div className="flex items-center gap-1 bg-white backdrop-blur-sm px-3 py-1.5 rounded-[12px] border border-white">
          <span className="text-sm font-medium text-gray-700 mr-1">Quality:</span>
          <span>Invalid format</span>
        </div>
      );
    }

    const value = Number(parts[0]);
    const total = Number(parts[1]);

    if (isNaN(value) || isNaN(total)) {
      console.warn(`Quality score contains non-numeric values: ${score}`);
      return (
        <div className="flex items-center gap-1 bg-white backdrop-blur-sm px-3 py-1.5 rounded-[12px] border border-white">
          <span className="text-sm font-medium text-gray-700 mr-1">Quality:</span>
          <span>Invalid value</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 bg-white backdrop-blur-sm px-3 py-1.5 rounded-[12px] border border-white">
        <span className="text-sm font-medium text-gray-700 mr-1">Quality:</span>
        <div className="flex">
          {[...Array(total)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < value ? 'text-[#EECE84] fill-[#EECE84]' : 'text-gray-300'}`}
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Quality Score */}
      <div className="flex items-center justify-end">
        {renderQualityStars(currentQuestion.quality_score)}
      </div>
      
      {/* Question Image */}
      {currentQuestion.question_images && (
        <>
          <div className="mb-6 flex justify-start">
            <motion.div
              className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsImageEnlarged(true)}
              style={{ maxWidth: '135px' }}
            >
              <img
                src={currentQuestion.question_images}
                alt=""
                className="w-full h-auto object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                  Click to enlarge
                </div>
              </div>
            </motion.div>
          </div>

          {/* Portal for Modal to ensure it's at the root level */}
          <AnimatePresence>
            {isImageEnlarged && (
              <div className="fixed inset-0 overflow-auto" style={{ zIndex: 9999 }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center bg-black/80 p-4"
                  onClick={() => {
                    setIsImageEnlarged(false);
                    setScale(1);
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="relative max-w-4xl max-h-[80vh] flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div 
                      ref={modalContentRef}
                      className="overflow-auto p-4 flex items-center justify-center"
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        maxHeight: '80vh'
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <img
                          src={currentQuestion.question_images}
                          alt=""
                          className="object-contain rounded-lg transition-transform duration-200"
                          style={{ 
                            transform: `scale(${scale})`, 
                            transformOrigin: 'center center',
                            maxWidth: '100%',
                            maxHeight: '100%'
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={handleZoomIn}
                        className="bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors duration-200"
                        aria-label="Zoom in"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleZoomOut}
                        className="bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors duration-200"
                        aria-label="Zoom out"
                      >
                        <ZoomOut className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsImageEnlarged(false);
                          setScale(1);
                        }}
                        className="bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors duration-200"
                        aria-label="Close"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Zoom indicator */}
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {Math.round(scale * 100)}%
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
      
      {Object.entries(options).map(([key, value], index) => {
        const answerResult = isAnswered(key);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative group"
          >
            {/* Tooltip */}
            {questionAnswered && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <Lock className="w-3.5 h-3.5" />
                  <span>You cannot change your answer</span>
                </div>
                <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
              </div>
            )}
            
            <button
              onClick={() => !questionAnswered && handleAnswer(questionId, key)}
              disabled={questionAnswered}
              className={`
                group/button relative w-full p-5 rounded-[20px] transition-all duration-300
                ${!questionAnswered && 'hover:scale-[1.02] hover:shadow-lg cursor-pointer'}
                ${questionAnswered && 'cursor-not-allowed'}
                ${answerResult?.status === 'correct' ? 'bg-green-50 border border-green-500' : 
                  answerResult?.status === 'incorrect' ? 'bg-red-50 border border-red-500' :
                  'bg-white backdrop-blur-sm border border-[#C1E0F1] hover:border-[#C1E0F1]/80'}
              `}
            >
              <div className="flex items-center gap-6">
                {/* Option Letter */}
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-xl text-lg font-semibold
                  transition-colors duration-300
                  ${answerResult?.status === 'correct' ? 'bg-green-100 text-green-700' :
                    answerResult?.status === 'incorrect' ? 'bg-red-100 text-red-700' :
                    'bg-[#C1E0F1]/50 text-black/50 group-hover/button:bg-[#C1E0F1]/30'}
                `}>
                  {key}
                </div>

                {/* Option Text */}
                <span className={`
                  flex-1 text-left text-lg
                  ${answerResult?.status === 'correct' ? 'text-green-700' :
                    answerResult?.status === 'incorrect' ? 'text-red-700' :
                    'text-gray-700'}
                `}>
                  {value}
                </span>

                {/* Selected Icon or Correct Answer Icon */}
                {answerResult?.showIcon && (
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full
                    ${answerResult.isCorrect ? 'bg-green-500' : 'bg-red-500'}
                  `}>
                    {answerResult.isCorrect ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <X className="w-5 h-5 text-white" />
                    )}
                  </div>
                )}
              </div>

              {/* Hover Effect Gradient */}
              <div className={`
                absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 
                ${!questionAnswered && 'group-hover/button:opacity-100'} 
                transition-opacity duration-300
                ${answerResult?.status === 'correct' ? 'from-green-100/20 to-transparent' :
                  answerResult?.status === 'incorrect' ? 'from-red-100/20 to-transparent' :
                  'from-[#C1E0F1]/20 to-transparent'}
              `} />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuestionOptions;