/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lock, Star, XCircle, ZoomIn, ZoomOut } from 'lucide-react';
import ImageViewer from '@/components/shared/ImageViewer';

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

  // Advanced Image Viewer states
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // Helper function to build complete image URLs
  const getImageUrls = () => {
    if (!currentQuestion.question_images) {
      return [];
    }
    
    let imageArray: string[] = [];
    
    if (Array.isArray(currentQuestion.question_images)) {
      imageArray = currentQuestion.question_images;
    } else if (typeof currentQuestion.question_images === 'string') {
      if (currentQuestion.question_images.includes(',')) {
        imageArray = currentQuestion.question_images.split(',').map(img => img.trim());
      } else {
        imageArray = [currentQuestion.question_images];
      }
    }
    
    const urls = imageArray.map(imageName => {
      // If it's already a complete URL, return as is
      if (imageName.startsWith('http')) {
        return imageName;
      }
      // If it starts with /questions/, use it as is (relative URL)
      if (imageName.startsWith('/questions/')) {
        return imageName;
      }
      // Otherwise, assume it's just a filename and add the relative path
      return `/questions/${imageName}`;
    });
    
    return urls;
  };

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
      
      {/* Question Images - Display ALL images */}
      {currentQuestion.question_images && (
        <>
          <div className="mb-6 flex flex-wrap gap-2 justify-start">
            {getImageUrls().map((imageUrl, index) => (
              <motion.div
                key={index}
                className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gray-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedImageIndex(index);
                  setIsImageViewerOpen(true);
                }}
                style={{ 
                  width: '120px', 
                  height: '80px',
                  userSelect: 'none' // Empêche la sélection de texte
                }}
              >
                <img
                  src={imageUrl}
                  alt={`Question image ${index + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                  style={{ 
                    imageRendering: 'crisp-edges' as any,
                    userSelect: 'none', // Empêche la sélection de texte
                    pointerEvents: 'none', // Empêche les événements de souris sur l'image
                    WebkitUserSelect: 'none' as any,
                    MozUserSelect: 'none' as any,
                    msUserSelect: 'none' as any
                  }}
                  onLoad={(e) => {
                    console.log('✅ Thumbnail loaded successfully:', imageUrl);
                  }}
                  onError={(e) => {
                    console.error('❌ Failed to load thumbnail:', imageUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                  draggable={false} // Empêche le drag
                />
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    Click to enlarge
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

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

      {/* Advanced Image Viewer */}
      <ImageViewer
        images={getImageUrls()}
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
};

export default QuestionOptions;