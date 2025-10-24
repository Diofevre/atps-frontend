/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ZoomIn, ZoomOut, XCircle, Plus, X, Edit3, Save } from 'lucide-react';
import { useAuth } from '@/lib/mock-clerk';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ImageViewer from '@/components/shared/ImageViewer';
import { toast } from 'sonner';

interface ChatExplanation {
  id: number;
  explanation: string;
}

interface ExplanationProps {
  explanation: string;
  questionId: number;
  chatExplanations?: ChatExplanation[];
  explanation_images: string | null;
  isDevMode?: boolean;
  uploadingExplanationImages?: boolean;
  onExplanationImageUpload?: (questionId: number, file: File) => Promise<void>;
  onExplanationImageDelete?: (questionId: number, imageIndex: number) => Promise<void>;
  onExplanationImageReplace?: (questionId: number, imageIndex: number, file: File) => Promise<void>;
  editingExplanationText?: number | null;
  tempExplanationText?: string;
  onEditExplanationText?: (questionId: number) => void;
  onSaveExplanationText?: () => void;
  onCancelEditExplanationText?: () => void;
  onTempExplanationTextChange?: (text: string) => void;
}

interface AIExplanation {
  id: number;
  new_explanation: string;
  date: string;
}

const Explanation: React.FC<ExplanationProps> = ({ 
  explanation, 
  questionId, 
  chatExplanations = [], 
  explanation_images,
  isDevMode = false,
  uploadingExplanationImages = false,
  onExplanationImageUpload,
  onExplanationImageDelete,
  onExplanationImageReplace,
  editingExplanationText = null,
  tempExplanationText = '',
  onEditExplanationText,
  onSaveExplanationText,
  onCancelEditExplanationText,
  onTempExplanationTextChange
}) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiExplanations, setAiExplanations] = useState<AIExplanation[]>([]);
  const [selectedExplanation, setSelectedExplanation] = useState<'original' | number>('original');
  const [currentText, setCurrentText] = useState(explanation);
  
  // Image zoom functionality
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

  const getExplanationImageUrls = useCallback(() => {
    if (!explanation_images) return [];
    try {
      const parsed = JSON.parse(explanation_images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [explanation_images]);

  const handleFileUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileReplace = useCallback((imageIndex: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.replaceIndex = imageIndex.toString();
      fileInputRef.current.click();
    }
  }, []);

  const triggerFileInput = useCallback((replaceIndex?: number) => {
    if (replaceIndex !== undefined) {
      handleFileReplace(replaceIndex);
    } else {
      handleFileUpload();
    }
  }, [handleFileUpload, handleFileReplace]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const replaceIndex = event.target.dataset.replaceIndex;
    
    if (replaceIndex !== undefined && onExplanationImageReplace) {
      onExplanationImageReplace(questionId, parseInt(replaceIndex), file);
    } else if (onExplanationImageUpload) {
      onExplanationImageUpload(questionId, file);
    }

    // Reset the input
    event.target.value = '';
    delete event.target.dataset.replaceIndex;
  }, [questionId, onExplanationImageUpload, onExplanationImageReplace]);

  // Helper function to build complete image URLs
  const getImageUrls = useCallback(() => {
    if (!explanation_images) return [];
    
    let imageArray: string[] = [];
    
    if (Array.isArray(explanation_images)) {
      imageArray = explanation_images;
    } else if (typeof explanation_images === 'string') {
      if (explanation_images.includes(',')) {
        imageArray = explanation_images.split(',').map(img => img.trim());
      } else {
        imageArray = [explanation_images];
      }
    }
    
    return imageArray.map(imageName => {
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
  }, [explanation_images]);

  const getCurrentExplanation = useCallback(() => {
    if (selectedExplanation === 'original') {
      return explanation;
    }
    
    // First check chatExplanations from the API
    const chatExplanation = chatExplanations.find(exp => exp.id === selectedExplanation);
    if (chatExplanation) {
      return chatExplanation.explanation;
    }
    
    // Then check locally generated explanations
    const aiExplanation = aiExplanations.find(exp => exp.id === selectedExplanation);
    return aiExplanation?.new_explanation || explanation;
  }, [selectedExplanation, aiExplanations, explanation, chatExplanations]);

  useEffect(() => {
    const text = getCurrentExplanation();
    setCurrentText(text);
  }, [selectedExplanation, aiExplanations, getCurrentExplanation]);

  const generateExplanation = async () => {
    setIsGenerating(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/ameliorate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_id: questionId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate explanation');
      }

      const data: AIExplanation = await response.json();
      setAiExplanations(prev => [...prev, data]);
      setSelectedExplanation(data.id);
      
      // Mise à jour immédiate sans rechargement de page
      console.log('✅ Nouvelle explication générée:', data.id);
    } catch (error) {
      console.error('Error generating explanation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setSelectedExplanation('original')}
            variant={selectedExplanation === 'original' ? 'default' : 'outline'}
            className="rounded-[12px]"
          >
            Original
          </Button>
          {chatExplanations.map((exp, index) => (
            <Button
              key={exp.id}
              onClick={() => setSelectedExplanation(exp.id)}
              variant={selectedExplanation === exp.id ? 'default' : 'outline'}
              className="rounded-[12px]"
            >
              Explanation {index + 1}
            </Button>
          ))}
          {aiExplanations.map((exp, index) => (
            <Button
              key={exp.id}
              onClick={() => setSelectedExplanation(exp.id)}
              variant={selectedExplanation === exp.id ? 'default' : 'outline'}
              className="rounded-[12px]"
            >
              New Explanation {index + 1}
            </Button>
          ))}
          <Button
            onClick={generateExplanation}
            disabled={isGenerating}
            className="bg-[#EECE84]/20 border border-[#EECE84] text-black hover:bg-[#EECE84]/70 rounded-[12px] gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Explanation
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {explanation_images && (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              {getImageUrls().map((imageUrl, index) => (
                <motion.div
                  key={index}
                  className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gray-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isDevMode) {
                      triggerFileInput(index); // Replace image
                    } else {
                      setSelectedImageIndex(index);
                      setIsImageViewerOpen(true); // View image
                    }
                  }}
                  style={{ 
                    width: '120px', 
                    height: '80px',
                    userSelect: 'none' // Empêche la sélection de texte
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Explanation image ${index + 1}`}
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
                      console.log('✅ Explanation thumbnail loaded successfully:', imageUrl);
                    }}
                    onError={(e) => {
                      console.error('❌ Failed to load explanation thumbnail:', imageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                    draggable={false} // Empêche le drag
                  />
                  {!isDevMode && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                        Click to enlarge
                      </div>
                    </div>
                  )}
                  {isDevMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExplanationImageDelete?.(questionId, index);
                      }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10"
                      title="Delete explanation image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {isDevMode && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                        Click to replace
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
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
                      Add explanation image
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

          </>
        )}

        {!explanation_images && isDevMode && (
          <div className="mb-6 flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
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
                  Add explanation image
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="relative group">
          {editingExplanationText === questionId ? (
            <div className="space-y-2">
              <textarea
                value={tempExplanationText}
                onChange={(e) => onTempExplanationTextChange?.(e.target.value)}
                className="w-full text-[18px] leading-relaxed p-3 border border-[#EECE84] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EECE84]/50 resize-none"
                rows={8}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={onSaveExplanationText}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={onCancelEditExplanationText}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                className="quiz-explanation-text flex-1"
              >
                {currentText}
              </ReactMarkdown>
              {isDevMode && (
                <button
                  onClick={() => onEditExplanationText?.(questionId)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Edit Explanation Text"
                >
                  <Edit3 className="w-4 h-4 text-blue-600" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

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

export default Explanation;