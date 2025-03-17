'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import { 
  Power, 
  CheckCircle2, 
  XCircle, 
  Circle, 
  PinIcon,
  Clock,
  Calendar,
  HelpCircle,
  Trophy,
  RotateCw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FilterReviewExam from '../../_components/FilterReviewExam';
import ExamDetailsDialog from './ExamDetailsDialog';

interface ValidationData {
  message: string;
  timeSpent: string;
  exam_duration: string;
  dateOfValidation: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  notAnswered: number;
  scorePercentage: string;
  topic: string;
  details: {
    questionId: number;
    questionText: string;
    userAnswer: string | null;
    isCorrect: boolean;
    isPinned: string[];
    correctAnswer: string | null;
  }[];
}

const StatusIcon = ({ type }: { type: 'correct' | 'incorrect' | 'unanswered' }) => {
  const icons = {
    correct: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    incorrect: <XCircle className="w-5 h-5 text-red-500" />,
    unanswered: <Circle className="w-5 h-5 text-gray-400" />
  };
  return icons[type];
};

const StatCard = ({ 
  label, 
  value, 
  type 
}: { 
  label: string; 
  value: number; 
  type: 'correct' | 'incorrect' | 'unanswered' 
}) => (
  <div className="flex items-center gap-2">
    <StatusIcon type={type} />
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  </div>
);

const ReviewExamComponents = () => {
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');
  const [data, setData] = useState<ValidationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const router = useRouter();
  const [retaking, setRetaking] = useState(false);
  const storedData = localStorage.getItem('validationData');

  useEffect(() => {
    if (storedData) {
      try {
        const parsedData: ValidationData = JSON.parse(storedData);
        setData(parsedData);
        setLoading(false);
      } catch {
        setError('Failed to parse validation data');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [storedData]);

  const handleTryAgain = async () => {
    try {
      setRetaking(true);
      if (!examId) throw new Error('Exam ID is missing');
  
      const parsedData = storedData ? JSON.parse(storedData) : null;
      const timeSpent = parsedData?.exam_duration;
  
      if (!timeSpent) {
        throw new Error('Exam duration not found');
      }
  
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('answeredQuestions');
      localStorage.removeItem('examRemainingTime');
      localStorage.removeItem('validationData');
  
      router.push(`/questions-bank/exam/quizz_exam?examId=${examId}&duration=${timeSpent}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restart exam');
      setRetaking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!data) return null;

  const filteredQuestions = data.details.filter(q => {
    switch (filter) {
      case 'correct': 
        return q.isCorrect;
      case 'incorrect': 
        return !q.isCorrect && q.userAnswer !== null;
      case 'notAnswered': 
        return q.userAnswer === null;
      case 'pinned': 
        return q.isPinned.some(flag => ['red', 'orange', 'green'].includes(flag));
      default: 
        return true;
    }
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-white/10 to-blue-500/10 dark:from-emerald-500/5 dark:to-blue-500/5 p-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              {/* Left side - Title and metadata */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-8 h-8 text-emerald-500" />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{data.topic}</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                    <span>{data.totalQuestions} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(data.dateOfValidation).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{data.timeSpent}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Stats and Score */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Stats */}
                <div className="space-y-3 min-w-[200px]">
                  <StatCard 
                    label="Correct"
                    value={data.correctAnswers}
                    type="correct"
                  />
                  <StatCard 
                    label="Incorrect"
                    value={data.incorrectAnswers}
                    type="incorrect"
                  />
                  <StatCard 
                    label="Unanswered"
                    value={data.notAnswered}
                    type="unanswered"
                  />
                </div>

                {/* Vertical separator */}
                <Separator orientation="vertical" className="h-24 hidden md:block" />

                {/* Score Circle */}
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      className="stroke-gray-200 dark:stroke-gray-700"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      className="stroke-emerald-500"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="314"
                      strokeDashoffset={314 - (Number(data.scorePercentage) / 100) * 314}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[20px] font-bold text-emerald-500">{data.scorePercentage}%</span>
                    <span className="text-xs text-gray-500">Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-row items-center gap-2">
          <FilterReviewExam onFilterChange={setFilter} />
          <button
            onClick={handleTryAgain}
            disabled={retaking}
            className="
              group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 
              text-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 
              focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCw className={`w-4 h-4 ${retaking ? 'animate-spin' : ''}`} />
            <span className="font-medium">
              {retaking ? 'Restarting...' : 'Try Again'}
            </span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('currentQuestionIndex');
              localStorage.removeItem('answeredQuestions');
              localStorage.removeItem('examEndTime');
              router.push('/questions-bank/exam');
            }}
            className="
              group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#EECE84]/80 to-white/50 
              rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 
              focus:ring-offset-2"
          >
            <Power className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="font-medium">
              Exit
            </span>
          </button>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <ExamDetailsDialog
              key={question.questionId}
              questionId={question.questionId}
              examId={Number(examId)}
            >
              <Card
                key={question.questionId}
                className={`p-6 cursor-pointer ${
                  question.userAnswer === null
                    ? 'border-l-4 border-l-gray-400'
                    : question.isCorrect
                    ? 'border-l-4 border-l-emerald-500'
                    : 'border-l-4 border-l-red-500'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{question.questionText}</h3>
                    {question.isPinned && question.isPinned.length > 0 && question.isPinned.map((color, index) => (
                      <PinIcon
                        key={index}
                        className={`w-6 h-6 ${
                          color === 'red'
                            ? 'text-red-500 fill-red-500'
                            : color === 'orange'
                            ? 'text-orange-500 fill-orange-500'
                            : 'text-green-500 fill-green-500'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Your answer:</span>
                      <span className={question.isCorrect ? 'text-emerald-600' : 'text-red-600'}>
                        {question.userAnswer || 'Not answered'}
                      </span>
                    </div>

                    {question.userAnswer && !question.isCorrect && question.correctAnswer && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Correct answer:</span>
                        <span className="text-emerald-600">{question.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusIcon 
                      type={
                        question.userAnswer === null
                          ? 'unanswered'
                          : question.isCorrect
                          ? 'correct'
                          : 'incorrect'
                      }
                    />
                    <span className="text-sm text-gray-600">
                      {question.userAnswer === null
                        ? 'Not answered'
                        : question.isCorrect
                        ? 'Correct'
                        : 'Incorrect'}
                    </span>
                  </div>
                </div>
              </Card>
            </ExamDetailsDialog>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewExamComponents;