'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { MessageCircle, Info, Eye, BookOpen, Lightbulb } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Loader } from '@/components/ui/loader';
import ReviewForm from '../../questions-bank/_components/ReviewForm';
import CommentsQuizz from '../../questions-bank/_components/CommentsQuizz';

interface QuestionDetails {
  question_text: string;
  answer: string;
  options: Record<string, string> | null;
  explanation: string;
  countries: Record<string, Record<string, string[]>>;
  user_answer: string | null;
  is_correct: boolean | null;
}

interface QuestionDetailsDialogProps {
  questionId: number;
  children: React.ReactNode;
  onClose?: () => void;
}

export default function QuestionSearchDialog({
  questionId,
  children,
  onClose
}: QuestionDetailsDialogProps) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [details, setDetails] = useState<QuestionDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchQuestionDetails = useCallback(async () => {
    if (!open || !questionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${questionId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch question details');
      }

      const data = await response.json();
      setDetails(data.question);
    } catch (err) {
      console.error('Error fetching question details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [questionId, getToken, open]);

  useEffect(() => {
    if (open) {
      fetchQuestionDetails();
    }
  }, [open, fetchQuestionDetails]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setDetails(null);
      onClose?.();
    }
  };

  const getCountryList = (countries: Record<string, Record<string, string[]>>) => {
    return Object.keys(countries);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">
            <p>Error loading question details:</p>
            <p>{error}</p>
          </div>
        ) : details ? (
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
                <div className="bg-white rounded-[20px] p-4 max-w-[620px] mx-auto border border-[#EECE84]/50 shadow-sm">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">Available in</h3>
                  <div className="flex flex-wrap gap-2 mb-1">
                    {getCountryList(details.countries).map((country, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EECE84]/20 text-black/80 border border-[#EECE84]/50"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
                <ReviewForm questionId={questionId} userId={user?.id || ''} />
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No question details available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function OverviewTab({ details }: { details: QuestionDetails }) {
  const countryList = Object.keys(details.countries);

  return (
    <Card className="p-6 max-h-[calc(80vh-8rem)] overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold leading-relaxed text-gray-900 dark:text-gray-100">
              {details.question_text}
            </h3>
            <div className="mt-2 space-y-2">
              {countryList.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {countryList.map((country, index) => (
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
              {details.is_correct !== null && (
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  details.is_correct
                    ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {details.is_correct ? 'Correct' : 'Incorrect'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {details.options ? (
          Object.entries(details.options).map(([key, value]) => {
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
          })
        ) : (
          <div className="text-gray-500 text-center py-4">No options available</div>
        )}
      </div>
    </Card>
  );
}

function ExplanationTab({ explanation }: { explanation: string }) {
  return (
    <Card className="p-6 max-h-[calc(80vh-8rem)] overflow-hidden flex flex-col">
      <div className="space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="flex items-center gap-3 pb-4 border-b dark:border-gray-800 sticky top-0 bg-card z-10">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Detailed Explanation
          </h3>
        </div>

        <div className="relative">
          <div className="absolute top-0 left-4 w-px h-full bg-gradient-to-b from-blue-500/20 to-transparent" />
          <div className="pl-8 space-y-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
              {explanation}
            </p>

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