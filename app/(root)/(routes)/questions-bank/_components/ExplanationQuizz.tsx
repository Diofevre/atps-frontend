/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ZoomIn, ZoomOut, XCircle } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatExplanation {
  id: number;
  explanation: string;
}

interface ExplanationProps {
  explanation: string;
  questionId: number;
  chatExplanations?: ChatExplanation[];
  explanation_images: string | null;
}

interface AIExplanation {
  id: number;
  new_explanation: string;
  date: string;
}

const Explanation: React.FC<ExplanationProps> = ({ explanation, questionId, chatExplanations = [], explanation_images }) => {
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

      router.refresh();
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
            <div className="mb-6">
              <motion.div
                className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsImageEnlarged(true)}
                style={{ maxWidth: '30%' }}
              >
                <img
                  src={explanation_images}
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

            {/* Image Modal */}
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
                            src={explanation_images}
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

        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          className="text-[18px] leading-relaxed"
        >
          {currentText}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Explanation;