'use client'

import React, { useEffect, useState } from 'react'
import { Filters } from '../_components/Filters';
import Topics from '../_components/Topics';
import { useRouter } from 'next/navigation';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Loader } from '@/components/ui/loader';
import { motion } from 'framer-motion';
import { FaPlayCircle } from "react-icons/fa";
import { useAuth } from '@/lib/mock-clerk';

interface SubChapter {
  id: string;
  sub_chapter_text: string;
  questionCount: number;
}

interface Chapter {
  id: string;
  chapter_text: string;
  chapterQuestionCount: number;
  subChapters: SubChapter[];
}

interface FetchChaptersParams {
  countries: string | null;
  question_not_seen: boolean;
  green_tag: boolean;
  red_tag: boolean;
  orange_tag: boolean;
  wrong_answer: boolean;
  last_exam: number,
}

const Study = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [startQuizLoading, setStartQuizLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string>('');

  // Select
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [selectedSubChapters, setSelectedSubChapters] = useState<Set<string>>(new Set());
  const [selectAllVisible, setSelectAllVisible] = useState(false);
  
  // Active all chapter and sub_chapter
  const [filterApplied, setFilterApplied] = useState(false);
  
  // Number of questions
  const [questionCount, setQuestionCount] = useState<number>(1);

  // Filters
  const [filters, setFilters] = useState({
    country: null,
    greenTag: false,
    redTag: false,
    orangeTag: false,
    seenInExam: false,
    neverSeen: false,
    wrongAnswer: false,
    lastExam: 0,
  });

  useEffect(() => {
    const fetchChapters = async () => {
      const token = await getToken();
    
      if (!topicId) {
        setChapters([]);
        return;
      }
    
      setLoading(true);
    
      try {
        const params: FetchChaptersParams = {
          countries: filters.country,
          question_not_seen: filters.neverSeen,
          green_tag: filters.greenTag,
          red_tag: filters.redTag,
          orange_tag: filters.orangeTag,
          wrong_answer: filters.wrongAnswer,
          last_exam: filters.lastExam,
        };

        const queryParams = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        );
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/topics/${topicId}/chapters?${queryParams.toString()}`, 
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des chapitres');
        }
        
        const data = await response.json();
  
        // Vérification du format des données
        if (Array.isArray(data)) {
          setChapters(data);
        } else if (data.chapters && Array.isArray(data.chapters)) {
          setChapters(data.chapters);
        } else {
          console.error('Les données récupérées ne correspondent pas au format attendu:', data);
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
  }, [getToken, topicId, filters]);

  useEffect(() => {
    if (filterApplied) {
      const chapterIds = chapters.map((chapter) => chapter.id);
      const subChapterIds = chapters.flatMap((chapter) =>
        chapter.subChapters.map((sub) => sub.id)
      );
  
      setSelectedChapters(new Set(chapterIds));
      setSelectedSubChapters(new Set(subChapterIds));
    }
  }, [filterApplied, chapters]);

  useEffect(() => {
    const anyChapterSelected = chapters.some((chapter) => selectedChapters.has(chapter.id));
    setSelectAllVisible(anyChapterSelected);
  }, [chapters, selectedChapters]);  

  useEffect(() => {
    if (chapters.length > 0) {
      const totalQuestions = chapters.reduce((sum, chapter) => sum + chapter.chapterQuestionCount, 0);
      setQuestionCount(totalQuestions);
    }
  }, [chapters]);  

  useEffect(() => {
    const totalQuestionsSelected = chapters
      .filter((chapter) => selectedChapters.has(chapter.id))
      .reduce((sum, chapter) => {
        const subChapterQuestions = chapter.subChapters
          .filter((subChapter) => selectedSubChapters.has(subChapter.id))
          .reduce((subSum, subChapter) => subSum + subChapter.questionCount, 0);
        return sum + subChapterQuestions;
      }, 0);
  
    setQuestionCount(totalQuestionsSelected);
  }, [selectedChapters, selectedSubChapters, chapters]);

  const toggleDropdown = (chapterId: string) => {
    setOpenDropdown(openDropdown === chapterId ? null : chapterId);
  };

  const handleSyllabusChange = (value: string) => {
    setTopicId(value);
    setFilterApplied(true);
  };

  const handleSelectAllVisible = () => {
    const visibleChapterIds = chapters.map((chapter) => chapter.id);
    const visibleSubChapterIds = chapters.flatMap((chapter) =>
      chapter.subChapters.map((sub) => sub.id)
    );

    if (selectAllVisible) {
      // Unselect all visible
      setSelectedChapters((prev) => {
        const updated = new Set(prev);
        visibleChapterIds.forEach((id) => updated.delete(id));
        return updated;
      });

      setSelectedSubChapters((prev) => {
        const updated = new Set(prev);
        visibleSubChapterIds.forEach((id) => updated.delete(id));
        return updated;
      });
    } else {
      // Select all visible
      setSelectedChapters((prev) => {
        const updated = new Set(prev);
        visibleChapterIds.forEach((id) => updated.add(id));
        return updated;
      });

      setSelectedSubChapters((prev) => {
        const updated = new Set(prev);
        visibleSubChapterIds.forEach((id) => updated.add(id));
        return updated;
      });
    }

    setSelectAllVisible(!selectAllVisible);
  };

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapters((prev) => {
      const updated = new Set(prev);
      if (updated.has(chapterId)) {
        updated.delete(chapterId);
        const subChapterIds = chapters
          .find((chapter) => chapter.id === chapterId)
          ?.subChapters.map((sub) => sub.id);
        setSelectedSubChapters((prev) => {
          const subUpdated = new Set(prev);
          subChapterIds?.forEach((id) => subUpdated.delete(id));
          return subUpdated;
        });
      } else {
        updated.add(chapterId);
        const subChapterIds = chapters
          .find((chapter) => chapter.id === chapterId)
          ?.subChapters.map((sub) => sub.id);
        setSelectedSubChapters((prev) => {
          const subUpdated = new Set(prev);
          subChapterIds?.forEach((id) => subUpdated.add(id));
          return subUpdated;
        });
      }
      return updated;
    });
  };

  const handleSubChapterSelect = (chapterId: string, subChapterId: string) => {
    setSelectedSubChapters((prev) => {
      const updated = new Set(prev);
      if (updated.has(subChapterId)) {
        updated.delete(subChapterId);
      } else {
        updated.add(subChapterId);
      }

      // Update chapter selection based on subchapter state
      const subChapters = chapters.find((chapter) => chapter.id === chapterId)?.subChapters || [];
      const allSubChaptersSelected = subChapters.every((sub) => updated.has(sub.id));
      const anySubChapterSelected = subChapters.some((sub) => updated.has(sub.id));

      setSelectedChapters((prev) => {
        const updatedChapters = new Set(prev);
        if (allSubChaptersSelected || anySubChapterSelected) {
          updatedChapters.add(chapterId);
        } else {
          updatedChapters.delete(chapterId);
        }
        return updatedChapters;
      });

      return updated;
    });
  };

  // Calculer les questions totales des chapitres et sous-chapitres sélectionnés
  const totalQuestionsSelected = chapters
    .filter((chapter) => selectedChapters.has(chapter.id))
    .reduce((sum, chapter) => {
      const subChapterQuestions = chapter.subChapters
        .filter((subChapter) => selectedSubChapters.has(subChapter.id))
        .reduce((subSum, subChapter) => subSum + subChapter.questionCount, 0);

      return sum + subChapterQuestions;
    }, 0);

  // Button start QUIZZ
  const handleStartQuiz = async () => {
    setStartQuizLoading(true);
    try {
      // Remove storage
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('answeredQuestions');
      localStorage.removeItem('timeSpents');
    
      const selectedChapterIds = Array.from(selectedChapters);
      const selectedSubChapterIds = Array.from(selectedSubChapters);
    
      const quizData = {
        chapters: selectedChapterIds,
        subChapters: selectedSubChapterIds,
        questionCount,
      };
    
      const queryParams = new URLSearchParams({
        data: JSON.stringify(quizData),
      });
  
      // Ajouter un délai artificiel de 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
    
      router.push(`/questions-bank/study/quizz?${queryParams}`);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setStartQuizLoading(false);
    }
  };

  // Handle Filter change
  const handleFilterChange = (filterName: string, value: boolean | number | string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      country: null,
      greenTag: false,
      redTag: false,
      orangeTag: false,
      seenInExam: false,
      neverSeen: false,
      wrongAnswer: false,
      lastExam: 0,
    });
  };

  return (
    <div className="flex flex-col space-y-4 max-w-[1050px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filters - Added padding for mobile */}
      <div className='mt-4'>
        <Filters
          filters={{
            ...filters,
            country: filters.country === "0" ? "All Examining Authorities" : filters.country,
          }}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Topics - Center aligned */}
      <div className="flex h-full items-center justify-center w-full">
        <Topics onSelectionChange={handleSyllabusChange} />
      </div>


      {loading ? (
        <div className="flex h-full w-full items-center justify-center p-8">
          <Loader />
        </div>
      ) : (
        chapters.length > 0 && (
          <div className="w-full space-y-4">
            {/* Header row */}
            <div className="flex justify-between items-center px-4 sm:px-4">
              <div className="flex items-center gap-1.5">
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectAllVisible}
                  onChange={handleSelectAllVisible}
                />
                <span className="text-sm sm:text-base font-semibold">SUBJECTS</span>
              </div>
              <span className="text-sm sm:text-base font-semibold">QUESTIONS</span>
            </div>

            {/* Chapters list */}
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="bg-white dark:bg-transparent border rounded-xl shadow-lg p-3 sm:p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleDropdown(chapter.id)}
                  >
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <Input
                        type="checkbox"
                        className="h-4 w-4 flex-shrink-0"
                        checked={selectedChapters.has(chapter.id)}
                        onChange={() => handleChapterSelect(chapter.id)}
                      />
                      <span className="text-sm sm:text-base truncate">{chapter.chapter_text}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="text-xs sm:text-sm text-gray-500">{chapter.chapterQuestionCount}</span>
                      {chapter.subChapters.some(subChapter =>
                        subChapter.sub_chapter_text.trim() !== "" &&
                        subChapter.sub_chapter_text.toLowerCase() !== "pas de nom"
                      ) && (
                        <ChevronDown
                          className={`w-4 h-4 sm:w-6 sm:h-6 transform transition-transform ${
                            openDropdown === chapter.id ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                  </div>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={openDropdown === chapter.id ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="pl-2 sm:pl-4 mt-2 space-y-2">
                      {chapter.subChapters.map((subChapter) => (
                        subChapter.sub_chapter_text.trim() !== "" && subChapter.sub_chapter_text.toLowerCase() !== "pas de nom" ? (
                            <div key={subChapter.id} className="flex justify-between items-center p-2 sm:p-3 border rounded-lg">
                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                    <Input
                                        type="checkbox"
                                        className="h-4 w-4 flex-shrink-0"
                                        checked={selectedSubChapters.has(subChapter.id)}
                                        onChange={() => handleSubChapterSelect(chapter.id, subChapter.id)}
                                    />
                                    <span className="text-sm truncate">{subChapter.sub_chapter_text}</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500 ml-2">{subChapter.questionCount}</span>
                            </div>
                        ) : null
                      ))}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Question count controls */}
            <div className="bg-white/50 dark:bg-gray-800 border rounded-xl shadow-md p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex flex-col items-center w-full sm:w-auto">
                  <div className="relative w-full sm:w-[120px]">
                    <Input
                      id="questionCount"
                      type="number"
                      min="1"
                      max={totalQuestionsSelected}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full text-center border rounded-md pr-12 dark:bg-gray-700 dark:text-white"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm flex items-center gap-1 text-gray-500">
                      <span>/</span>
                      <span>{totalQuestionsSelected}</span>
                    </div>
                  </div>
                </div>
                <Slider
                  id="questionSlider"
                  className="w-full"
                  value={[questionCount]}
                  min={1}
                  max={totalQuestionsSelected}
                  onValueChange={(value) => setQuestionCount(value[0])}
                />
              </div>
            </div>

            {/* Start button */}
            <div className="flex justify-center py-4">
              <button
                className={`bg-[#EECE84] text-black rounded-xl hover:bg-[#EECE84]/90 px-6 h-12 text-sm gap-1 flex items-center ${
                  startQuizLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleStartQuiz}
                disabled={startQuizLoading}
              >
                {startQuizLoading ? (
                  <Loader2 className="animate-spin text-black h-5 w-5" />
                ) : (
                  <>
                    <FaPlayCircle />
                    <span className="text-[12px] font-black">START LEARNING</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Study;