'use client';

import { Send, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

type ReportIssue = {
  categorie: string;
  description: string;
};

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: { userId: string; categorie: string; contenu: string }) => void;
  userId: string;
};

const issuesList: ReportIssue[] = [
  { categorie: "Inaccurate", description: "Inaccurate content refers to information in the course that is incorrect, misleading, or factually wrong. Reporting it ensures the course maintains its reliability." },
  { categorie: "Outdated", description: "Outdated content is material that is no longer relevant or up-to-date. Reporting it helps keep courses aligned with current knowledge and standards." },
  { categorie: "Incomplete", description: "Incomplete content refers to missing sections, examples, or explanations that are necessary for understanding the course." },
  { categorie: "Display", description: "A display issue occurs when course content is visually distorted or not properly formatted, affecting readability or usability." },
  { categorie: "Other Issue", description: "Other issues cover any problem not listed, including technical glitches or concerns about the course's quality or structure." },
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, userId }) => {
  const [selectedIssue, setSelectedIssue] = useState<ReportIssue | null>(null);
  const [commentary, setCommentary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedIssue || !commentary.trim()) {
      toast.error("Please select an issue and provide commentary.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        userId,
        categorie: selectedIssue.categorie,
        contenu: commentary,
      });
      
      setSelectedIssue(null);
      setCommentary("");
      onClose();
      toast.success("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999]"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div className="min-h-screen px-4 text-center flex items-center justify-center">
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl relative mx-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedIssue && (
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-xl font-semibold text-gray-900">Report Issue</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
              <AnimatePresence mode="wait">
                {!selectedIssue ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-3"
                  >
                    {issuesList.map((issue, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full p-4 bg-gray-50 rounded-xl text-left transition-all hover:bg-[#EECE84]/50 group"
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <div className="font-medium text-gray-900 group-hover:text-[#000] transition-colors">
                          {issue.categorie}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{issue.description}</div>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="text-lg font-medium text-gray-900 mb-2">
                        {selectedIssue.categorie}
                      </div>
                      <p className="text-sm text-gray-600">{selectedIssue.description}</p>
                    </div>
                    <div>
                      <label className="block font-medium text-gray-900 mb-2">
                        Provide Additional Details
                      </label>
                      <textarea
                        value={commentary}
                        onChange={(e) => setCommentary(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#EECE84] focus:border-transparent transition-all"
                        rows={4}
                        placeholder="Please describe the issue in detail..."
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-[12px] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedIssue || !commentary.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-[#EECE84] text-black rounded-[12px] hover:bg-[#EECE84]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-black rounded-[12px] animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Report</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ReportModal;