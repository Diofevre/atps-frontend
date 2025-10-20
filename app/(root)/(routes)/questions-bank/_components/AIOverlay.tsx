"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import AIChat from './AIChats';

interface AIOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  questionId: number;
}

const AIOverlay: React.FC<AIOverlayProps> = ({ 
  isVisible, 
  onClose, 
  questionId
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [width, setWidth] = useState(490); // largeur initiale réduite de 10px
  const [isResizing, setIsResizing] = useState(false);

  // Drag handlers to resize from the left edge of the panel
  const onResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;
    const onMouseMove = (e: MouseEvent) => {
      // Panel is anchored to the right, so width = window.innerWidth - mouseX
      const newWidth = window.innerWidth - e.clientX;
      const clamped = Math.max(360, Math.min(760, newWidth));
      setWidth(clamped);
    };
    const onMouseUp = () => setIsResizing(false);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Overlay Content - Positioned to the right */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`
              absolute right-0 top-0 bottom-0
              ${isMinimized ? 'h-16' : 'h-full'}
              bg-white shadow-2xl border-l border-gray-200/50
              flex flex-col overflow-hidden pointer-events-auto
            `}
            style={{ width: `${width}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Invisible-but-grabbable resize handle on the left edge */}
            <div
              onMouseDown={onResizeMouseDown}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize"
              style={{ zIndex: 10, background: 'transparent' }}
            />
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-[#EECE84]/10 to-[#EECE84]/5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#EECE84] rounded-lg">
                  <Image src="/atps-default.png" alt="ATPS" className="w-4 h-4" width={16} height={16} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    IA #{questionId}
                  </h2>
                  <p className="text-xs text-gray-600">
                    Assistant IA
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title={isMinimized ? "Agrandir" : "Réduire"}
                >
                  <div className={`w-3 h-3 transition-transform ${isMinimized ? 'rotate-180' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </div>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Fermer"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* AI Chat Area - Full Height */}
                <div className="flex-1 overflow-hidden">
                  <AIChat questionId={questionId} />
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIOverlay;
