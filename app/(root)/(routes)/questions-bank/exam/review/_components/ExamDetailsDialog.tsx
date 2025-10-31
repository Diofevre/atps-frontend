'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { MessageCircle, Info, Eye, BookOpen, Lightbulb } from 'lucide-react';
import { useAuth, useUser } from '@/lib/mock-clerk';
import { useState, useEffect } from 'react';
import { Loader } from '@/components/ui/loader';
import ReviewForm from '../../../_components/ReviewForm';
import CommentsQuizz from '../../../_components/CommentsQuizz';

interface QuestionDetails {
  question_text: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  countries: string[];
  user_answer: string;
  is_correct: boolean;
}

interface ExamDetailsDialogProps {
  questionId: number;
  examId: number;
  children: React.ReactNode;
}

export default function ExamDetailsDialog({ 
  questionId, 
  examId,
  children 
}: ExamDetailsDialogProps) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [details, setDetails] = useState<QuestionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const testId = 0;

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${questionId}/${testId}/${examId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch question details');
        const data = await response.json();

        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [questionId, getToken, examId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : details && (
          <Tabs defaultValue="overview" className="h-full">
            <TabsList className="grid w-full grid-cols-4 rounded-full">
              <TabsTrigger value="overview" className="flex items-center gap-2 rounded-full">
                <Eye className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="explanation" className="flex items-center gap-2 rounded-full">
                <BookOpen className="w-4 h-4" />
                <span>Explanation</span>
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2 rounded-full">
                <MessageCircle className="w-4 h-4" />
                <span>Comments</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 rounded-full">
                <Info className="w-4 h-4" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 h-[calc(100%-4rem)] overflow-y-auto">
              <TabsContent value="overview" className="h-full">
                <OverviewTab details={details} />
              </TabsContent>
              
              <TabsContent value="explanation" className="h-full">
                <ExplanationTab explanation={details.explanation} />
              </TabsContent>
              
              <TabsContent value="comments" className="h-full">
                <CommentsTab questionId={questionId} />
              </TabsContent>
              
              <TabsContent value="preview" className="h-full">
                {/* Countries Section */}
                {details.countries?.length > 0 ? (
                  <div className="bg-white rounded-[20px] p-4 max-w-[620px] mx-auto border border-[#EECE84]/50 shadow-sm">
                    <h3 className="text-lg font-semibold mb-1 text-gray-800">Available in</h3>
                    <div className="flex flex-wrap gap-2 mb-1">
                      {details.countries.map((country, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EECE84]/20 text-black/80 border border-[#EECE84]/50"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                      No countries available
                    </span>
                )}
                <ReviewForm questionId={questionId} userId={user?.id || ''} />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

function OverviewTab({ details }: { details: QuestionDetails }) {
  return (
    <Card className="p-6 max-h-[calc(80vh-8rem)] overflow-y-auto">
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold leading-relaxed text-gray-900 dark:text-gray-100">
              {details.question_text}
            </h3>
            <div className="mt-2 space-y-2">
              {details.countries?.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {details.countries.map((country, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                  No countries available
                </span>
              )}
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                details.is_correct 
                  ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {details.is_correct ? 'Correct' : 'Incorrect'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid gap-3">
        {Object.entries(details.options).map(([key, value]) => {
          const isUserAnswer = details.user_answer === key;
          const isCorrectAnswer = details.answer === key;

          let optionStyle = '';
          if (isUserAnswer && details.is_correct) {
            optionStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm shadow-green-100 dark:shadow-green-900/10';
          } else if (isUserAnswer && !details.is_correct) {
            optionStyle = 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-sm shadow-red-100 dark:shadow-red-900/10';
          } else if (isCorrectAnswer) {
            optionStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm shadow-green-100 dark:shadow-green-900/10';
          } else {
            optionStyle = 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';
          }

          return (
            <div
              key={key}
              className={`relative flex items-center p-4 rounded-lg border transition-all ${optionStyle}`}
            >
              {/* Option indicator */}
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium ${
                  isUserAnswer || isCorrectAnswer
                    ? 'border-transparent bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white'
                    : 'border-gray-300 text-gray-500 dark:border-gray-600'
                }`}>
                  {key}
                </div>
                <span className="text-gray-900 dark:text-gray-100">{value}</span>
              </div>

              {/* Status indicators */}
              {(isUserAnswer || isCorrectAnswer) && (
                <div className="absolute right-4 flex items-center gap-2">
                  {isUserAnswer && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Your answer
                    </span>
                  )}
                  {isCorrectAnswer && !isUserAnswer && (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Correct answer
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ExplanationTab({ explanation }: { explanation: string }) {
  return (
    <Card className="p-6 max-h-[calc(80vh-8rem)] overflow-hidden flex flex-col">
      <div className="space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Header - Fixed at top */}
        <div className="flex items-center gap-3 pb-4 border-b dark:border-gray-800 sticky top-0 bg-card z-10">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Detailed Explanation
          </h3>
        </div>

        {/* Content - Scrollable */}
        <div className="relative">
          <div className="absolute top-0 left-4 w-px h-full bg-gradient-to-b from-blue-500/20 to-transparent" />
          <div className="pl-8 space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
              {explanation}
            </p>
            
            {/* Additional learning resources section */}
            <div className="mt-6 pt-6 border-t dark:border-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Lightbulb className="w-4 h-4" />
                <span className="font-medium">Pro Tip:</span>
                <span>Take notes and review this explanation multiple times for better retention.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CommentsTab({ questionId }: { questionId: number }) {
  const { user } = useUser();
  
  return (
    <Card className="p-6 max-h-[calc(80vh-8rem)] overflow-y-auto">
      <CommentsQuizz
        questionId={questionId}
        userId={user?.id || ''} 
      />
    </Card>
  );
}