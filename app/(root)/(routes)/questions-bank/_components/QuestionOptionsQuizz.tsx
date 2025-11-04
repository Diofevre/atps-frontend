/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lock, Star, XCircle, ZoomIn, ZoomOut, Edit3, Save, X as XIcon, Plus, Upload } from 'lucide-react';
import ImageViewer from '@/components/shared/ImageViewer';
import { toast } from 'sonner';

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
  isDevMode: boolean;
  editingQuestionId: number | null;
  tempQuestionId: string;
  onEditQuestionId: (questionId: number) => void;
  onSaveQuestionId: () => void;
  onCancelEdit: () => void;
  onTempQuestionIdChange: (value: string) => void;
  editingQuestionText: number | null;
  tempQuestionText: string;
  onEditQuestionText: (questionId: number) => void;
  onSaveQuestionText: () => void;
  onCancelEditText: () => void;
  onTempQuestionTextChange: (value: string) => void;
  uploadingImages: boolean;
  onImageUpload: (questionId: number, file: File) => void;
  onImageDelete: (questionId: number, imageIndex: number) => void;
  onImageReplace: (questionId: number, imageIndex: number, file: File) => void;
}

const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  options,
  answeredQuestions,
  questionId,
  handleAnswer,
  currentQuestion,
  isDevMode,
  editingQuestionId,
  tempQuestionId,
  onEditQuestionId,
  onSaveQuestionId,
  onCancelEdit,
  onTempQuestionIdChange,
  editingQuestionText,
  tempQuestionText,
  onEditQuestionText,
  onSaveQuestionText,
  onCancelEditText,
  onTempQuestionTextChange,
  uploadingImages,
  onImageUpload,
  onImageDelete,
  onImageReplace,
}) => {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [scale, setScale] = useState(1);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Advanced Image Viewer states
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageUpload(questionId, file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleFileReplace = (file: File, imageIndex: number) => {
    if (file && file.type.startsWith('image/')) {
      onImageReplace(questionId, imageIndex, file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const triggerFileInput = (imageIndex?: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.imageIndex = imageIndex?.toString() || '';
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageIndex = e.target.dataset.imageIndex;
      if (imageIndex) {
        handleFileReplace(file, parseInt(imageIndex));
      } else {
        handleFileUpload(file);
      }
    }
    // Reset input
    e.target.value = '';
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

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Question Images - Display ALL images */}
      <div className="mb-6 flex flex-wrap gap-2 justify-start">
        {/* Hidden file input for image uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Existing images */}
        {currentQuestion.question_images && getImageUrls().map((imageUrl, index) => (
          <motion.div
            key={index}
            className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gray-100"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (isDevMode) {
                // En mode dev, remplacer l'image
                triggerFileInput(index);
              } else {
                // Mode normal, ouvrir le visualiseur
                setSelectedImageIndex(index);
                setIsImageViewerOpen(true);
              }
            }}
            style={{ 
              width: '120px', 
              height: '80px',
              userSelect: 'none'
            }}
          >
            <img
              src={imageUrl}
              alt={`Question image ${index + 1}`}
              className="w-full h-full object-contain rounded-lg"
              style={{ 
                imageRendering: 'crisp-edges' as any,
                userSelect: 'none',
                pointerEvents: 'none',
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
              draggable={false}
            />
            
            {/* Overlay pour mode normal */}
            {!isDevMode && (
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                  Click to enlarge
                </div>
              </div>
            )}

            {/* Icône de suppression en mode dev */}
            {isDevMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageDelete(questionId, index);
                }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10"
                title="Delete image"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Overlay pour mode dev */}
            {isDevMode && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                  Click to replace
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {/* Placeholder pour ajouter une image en mode dev */}
        {isDevMode && (
          <motion.div
            className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gray-200 border-2 border-dashed border-gray-400 hover:border-[#EECE84]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerFileInput()}
            style={{ 
              width: '120px', 
              height: '80px',
              userSelect: 'none'
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-500 hover:text-[#EECE84] transition-colors" />
            </div>
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                Add image
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
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
                ${answerResult?.status === 'correct' ? 'bg-green-50 dark:bg-green-900/30 border border-green-500 dark:border-green-600' : 
                  answerResult?.status === 'incorrect' ? 'bg-red-50 dark:bg-red-900/30 border border-red-500 dark:border-red-600' :
                  'bg-white dark:bg-card backdrop-blur-sm border border-[#C1E0F1] dark:border-border hover:border-[#C1E0F1]/80 dark:hover:border-border-blue'}
              `}
            >
              <div className="flex items-center gap-6">
                {/* Option Letter */}
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-xl text-lg font-semibold
                  transition-colors duration-300
                  ${answerResult?.status === 'correct' ? 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300' :
                    answerResult?.status === 'incorrect' ? 'bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300' :
                    'bg-[#C1E0F1]/50 dark:bg-muted/50 text-black/50 dark:text-white/50 group-hover/button:bg-[#C1E0F1]/30 dark:group-hover/button:bg-muted/70'}
                `}>
                  {key}
                </div>

                {/* Option Text */}
                <span className={`
                  flex-1 text-left quiz-option-text
                  ${answerResult?.status === 'correct' ? 'text-green-700 dark:text-green-300' :
                    answerResult?.status === 'incorrect' ? 'text-red-700 dark:text-red-300' :
                    'text-gray-700 dark:text-white'}
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