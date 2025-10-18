'use client'

import React, { useEffect, useState } from 'react'
import { Filters } from '../_components/Filters';
import TopicsV2 from '../_components/TopicsV2';
import ChaptersV2 from '../_components/ChaptersV2';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { FaPlayCircle } from "react-icons/fa";
import { useAuth } from '@/lib/mock-clerk';

interface StudyV2State {
  selectedSubjectCode: string;
  selectedSubjectName: string;
  selectedChapters: string[];
  selectedSubChapters: string[];
  questionCount: number;
  maxQuestions: number;
}

const StudyV2 = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  
  const [state, setState] = useState<StudyV2State>({
    selectedSubjectCode: '',
    selectedSubjectName: '',
    selectedChapters: [],
    selectedSubChapters: [],
    questionCount: 1,
    maxQuestions: 1
  });
  
  const [startQuizLoading, setStartQuizLoading] = useState(false);

  // Filters (réutilisés de l'ancienne version)
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

  const handleSubjectChange = (subjectCode: string, subjectName: string) => {
    setState(prev => ({
      ...prev,
      selectedSubjectCode: subjectCode,
      selectedSubjectName: subjectName,
      selectedChapters: [],
      selectedSubChapters: [],
      questionCount: 1,
      maxQuestions: 1
    }));
  };

  const handleChaptersChange = (chapters: string[], subchapters: string[], questionCount: number) => {
    setState(prev => ({
      ...prev,
      selectedChapters: chapters,
      selectedSubChapters: subchapters,
      maxQuestions: questionCount,
      questionCount: Math.min(prev.questionCount, questionCount)
    }));
  };

  // Button start QUIZZ
  const handleStartQuiz = async () => {
    setStartQuizLoading(true);
    try {
      // Remove storage
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('answeredQuestions');
      localStorage.removeItem('timeSpents');
    
      const quizData = {
        chapters: state.selectedChapters,
        subChapters: state.selectedSubChapters,
        questionCount: state.questionCount,
        subject_code: state.selectedSubjectCode
      };
    
      const queryParams = new URLSearchParams({
        data: JSON.stringify(quizData),
      });
  
      // Ajouter un délai artificiel de 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
    
      router.push(`/questions-bank/study/quizz-v2?${queryParams}`);
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
      {/* Filters */}
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
        <TopicsV2 
          onSelectionChange={handleSubjectChange}
          selectedTopic={state.selectedSubjectCode}
          selectedTopicName={state.selectedSubjectName}
        />
      </div>

      {/* Chapters */}
      {state.selectedSubjectCode && (
        <ChaptersV2
          subjectCode={state.selectedSubjectCode}
          onSelectionChange={handleChaptersChange}
        />
      )}

      {/* Question count controls */}
      {state.maxQuestions > 1 && (
        <div className="bg-white/50 dark:bg-gray-800 border rounded-xl shadow-md p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex flex-col items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-[120px]">
                <Input
                  id="questionCount"
                  type="number"
                  min="1"
                  max={state.maxQuestions}
                  value={state.questionCount}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    questionCount: Math.min(Math.max(1, Number(e.target.value)), state.maxQuestions)
                  }))}
                  className="w-full text-center border rounded-md pr-12 dark:bg-gray-700 dark:text-white"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm flex items-center gap-1 text-gray-500">
                  <span>/</span>
                  <span>{state.maxQuestions}</span>
                </div>
              </div>
            </div>
            <Slider
              id="questionSlider"
              className="w-full"
              value={[state.questionCount]}
              min={1}
              max={state.maxQuestions}
              onValueChange={(value) => setState(prev => ({
                ...prev,
                questionCount: value[0]
              }))}
            />
          </div>
        </div>
      )}

      {/* Start button */}
      {state.selectedChapters.length > 0 && (
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
      )}
    </div>
  )
}

export default StudyV2;


