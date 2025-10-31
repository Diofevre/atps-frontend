"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/mock-clerk';

interface ChapterV2 {
  chapter_text: string;
  question_count: number;
  subchapters: SubChapterV2[];
}

interface SubChapterV2 {
  subchapter_text: string;
  question_count: number;
}

interface ChaptersV2Props {
  subjectCode: string;
  onSelectionChange: (chapters: string[], subchapters: string[], questionCount: number) => void;
}

const ChaptersV2: React.FC<ChaptersV2Props> = ({ subjectCode, onSelectionChange }) => {
  const { getToken } = useAuth();
  const [chapters, setChapters] = useState<ChapterV2[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [selectedSubChapters, setSelectedSubChapters] = useState<Set<string>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!subjectCode) {
        setChapters([]);
        return;
      }

      setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions-v2/chapter?subjectCode=${subjectCode}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des chapitres');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // Grouper les questions par chapitre et sous-chapitre
          const chapterMap = new Map<string, ChapterV2>();
          
          data.data.forEach((question: any) => {
            const chapterText = question.chapter_text;
            const subchapterText = question.subchapter_text;
            
            if (!chapterMap.has(chapterText)) {
              chapterMap.set(chapterText, {
                chapter_text: chapterText,
                question_count: 0,
                subchapters: []
              });
            }
            
            const chapter = chapterMap.get(chapterText)!;
            chapter.question_count++;
            
            // Trouver ou créer le sous-chapitre
            let subchapter = chapter.subchapters.find(sub => sub.subchapter_text === subchapterText);
            if (!subchapter) {
              subchapter = {
                subchapter_text: subchapterText,
                question_count: 0
              };
              chapter.subchapters.push(subchapter);
            }
            subchapter.question_count++;
          });
          
          const chaptersArray = Array.from(chapterMap.values());
          setChapters(chaptersArray);
        } else {
          setChapters([]);
        }
      } catch (error) {
        console.error('Erreur API:', error);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [subjectCode, getToken]);

  // Notifier le parent des sélections
  useEffect(() => {
    const totalQuestions = chapters
      .filter(chapter => selectedChapters.has(chapter.chapter_text))
      .reduce((sum, chapter) => {
        const subChapterQuestions = chapter.subchapters
          .filter(subchapter => selectedSubChapters.has(subchapter.subchapter_text))
          .reduce((subSum, subchapter) => subSum + subchapter.question_count, 0);
        return sum + subChapterQuestions;
      }, 0);

    onSelectionChange(
      Array.from(selectedChapters),
      Array.from(selectedSubChapters),
      totalQuestions
    );
  }, [selectedChapters, selectedSubChapters, chapters, onSelectionChange]);

  const toggleDropdown = (chapterText: string) => {
    setOpenDropdown(openDropdown === chapterText ? null : chapterText);
  };

  const handleChapterSelect = (chapterText: string) => {
    setSelectedChapters(prev => {
      const updated = new Set(prev);
      if (updated.has(chapterText)) {
        updated.delete(chapterText);
        // Désélectionner tous les sous-chapitres de ce chapitre
        const chapter = chapters.find(c => c.chapter_text === chapterText);
        if (chapter) {
          setSelectedSubChapters(prevSub => {
            const updatedSub = new Set(prevSub);
            chapter.subchapters.forEach(sub => updatedSub.delete(sub.subchapter_text));
            return updatedSub;
          });
        }
      } else {
        updated.add(chapterText);
        // Sélectionner tous les sous-chapitres de ce chapitre
        const chapter = chapters.find(c => c.chapter_text === chapterText);
        if (chapter) {
          setSelectedSubChapters(prevSub => {
            const updatedSub = new Set(prevSub);
            chapter.subchapters.forEach(sub => updatedSub.add(sub.subchapter_text));
            return updatedSub;
          });
        }
      }
      return updated;
    });
  };

  const handleSubChapterSelect = (chapterText: string, subchapterText: string) => {
    setSelectedSubChapters(prev => {
      const updated = new Set(prev);
      if (updated.has(subchapterText)) {
        updated.delete(subchapterText);
      } else {
        updated.add(subchapterText);
      }

      // Mettre à jour la sélection du chapitre basé sur les sous-chapitres
      const chapter = chapters.find(c => c.chapter_text === chapterText);
      if (chapter) {
        const allSubChaptersSelected = chapter.subchapters.every(sub => updated.has(sub.subchapter_text));
        const anySubChapterSelected = chapter.subchapters.some(sub => updated.has(sub.subchapter_text));

        setSelectedChapters(prevChapters => {
          const updatedChapters = new Set(prevChapters);
          if (allSubChaptersSelected || anySubChapterSelected) {
            updatedChapters.add(chapterText);
          } else {
            updatedChapters.delete(chapterText);
          }
          return updatedChapters;
        });
      }

      return updated;
    });
  };

  const handleSelectAll = () => {
    if (selectedChapters.size === chapters.length) {
      // Désélectionner tout
      setSelectedChapters(new Set());
      setSelectedSubChapters(new Set());
    } else {
      // Sélectionner tout
      const allChapterTexts = chapters.map(c => c.chapter_text);
      const allSubChapterTexts = chapters.flatMap(c => c.subchapters.map(s => s.subchapter_text));
      setSelectedChapters(new Set(allChapterTexts));
      setSelectedSubChapters(new Set(allSubChapterTexts));
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EECE84] mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading chapters...</p>
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No chapters found for this subject.</p>
      </div>
    );
  }

  const totalQuestions = chapters.reduce((sum, chapter) => sum + chapter.question_count, 0);
  const selectedQuestions = chapters
    .filter(chapter => selectedChapters.has(chapter.chapter_text))
    .reduce((sum, chapter) => {
      const subChapterQuestions = chapter.subchapters
        .filter(subchapter => selectedSubChapters.has(subchapter.subchapter_text))
        .reduce((subSum, subchapter) => subSum + subchapter.question_count, 0);
      return sum + subChapterQuestions;
    }, 0);

  return (
    <div className="w-full space-y-4">
      {/* Header row */}
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-1.5">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={selectedChapters.size === chapters.length && chapters.length > 0}
            onChange={handleSelectAll}
          />
          <span className="text-sm font-semibold">SUBJECTS ({totalQuestions} questions)</span>
        </div>
        <span className="text-sm font-semibold">
          {selectedQuestions} selected
        </span>
      </div>

      {/* Chapters list */}
      <div className="space-y-2">
        {chapters.map((chapter) => (
          <div key={chapter.chapter_text} className="bg-white dark:bg-transparent border rounded-xl shadow-lg p-3 sm:p-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown(chapter.chapter_text)}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  className="h-4 w-4 flex-shrink-0"
                  checked={selectedChapters.has(chapter.chapter_text)}
                  onChange={() => handleChapterSelect(chapter.chapter_text)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm truncate">{chapter.chapter_text}</span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <span className="text-xs text-gray-500">{chapter.question_count}</span>
                {chapter.subchapters.length > 0 && (
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      openDropdown === chapter.chapter_text ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>

            {chapter.subchapters.length > 0 && (
              <div className={`transition-all duration-300 ease-in-out ${
                openDropdown === chapter.chapter_text ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}>
                <div className="pl-2 mt-2 space-y-2">
                  {chapter.subchapters.map((subchapter) => (
                    <div key={subchapter.subchapter_text} className="flex justify-between items-center p-2 border rounded-lg">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          className="h-4 w-4 flex-shrink-0"
                          checked={selectedSubChapters.has(subchapter.subchapter_text)}
                          onChange={() => handleSubChapterSelect(chapter.chapter_text, subchapter.subchapter_text)}
                        />
                        <span className="text-sm truncate">{subchapter.subchapter_text}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{subchapter.question_count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChaptersV2;


