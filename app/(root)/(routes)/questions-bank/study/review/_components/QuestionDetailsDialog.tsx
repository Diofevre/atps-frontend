'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { MessageCircle, Info, Eye, BookOpen, Lightbulb } from 'lucide-react';
import { useAuth } from '@/lib/mock-clerk';
import { Loader } from '@/components/ui/loader';
import CommentsQuizz from '../../../_components/CommentsQuizz';

// Fonction utilitaire pour formater le markdown (copiée depuis AIChats.tsx)
function formatMarkdown(text: string): string {
  if (!text) return '';
  
  let html = text;
  
  // Tableaux (markdown simple)
  html = html.replace(
    /^(\|.*\|)\n(\|[-:\s|]+\|)\n((?:\|.*\|\n?)*)/gm,
    (match, header, separator, rows) => {
      const headerCells = header.split('|').slice(1, -1).map((cell: string) => 
        `<th class="px-3 py-2 text-left font-medium text-gray-900 bg-gray-50 border-b break-words min-w-0 max-w-none">${cell.trim()}</th>`
      ).join('');
      
      const rowLines = rows.trim().split('\n').filter((line: string) => line.trim());
      const tableRows = rowLines.map((row: string) => {
        const cells = row.split('|').slice(1, -1).map((cell: string) => {
          const cellContent = cell.trim();
          const isLongContent = cellContent.length > 50;
          const cellClass = isLongContent 
            ? "px-3 py-2 border-b break-words min-w-0 max-w-none whitespace-normal"
            : "px-3 py-2 border-b break-words min-w-0";
          return `<td class="${cellClass}">${cellContent}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      
      return `
        <div class="overflow-x-auto my-4 max-w-full">
          <table class="w-full border border-gray-200 rounded-lg break-words" style="table-layout: auto; min-width: 100%;">
            <thead>
              <tr>${headerCells}</tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      `;
    }
  );

  // Code blocks (```code```)
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-3 max-w-full break-words"><code class="text-sm break-words">$2</code></pre>'
  );

  // Code inline
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

  // Gras
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Italique
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Listes numérotées
  html = html.replace(
    /^(\d+\.\s.*(?:\n(?!(?:\d+\.|\n)).*)*)/gm,
    (match) => {
      const items = match.split('\n').map(line => {
        const text = line.replace(/^\d+\.\s/, '').trim();
        return text ? `<li class="mb-1">${text}</li>` : '';
      }).filter(item => item).join('');
      
      return `<ol class="list-decimal list-inside my-3 space-y-1">${items}</ol>`;
    }
  );

  // Listes à puces
  html = html.replace(
    /^([-\*\+]\s.*(?:\n(?![-\*\+\n]).*)*)/gm,
    (match) => {
      const items = match.split('\n').map(line => {
        const text = line.replace(/^[-\*\+]\s/, '').trim();
        return text ? `<li class="mb-1">${text}</li>` : '';
      }).filter(item => item).join('');
      
      return `<ul class="list-disc list-inside my-3 space-y-1">${items}</ul>`;
    }
  );

  // Titres
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>');

  // Citations/blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-3">$1</blockquote>');

  // Images aviation (détecter les URLs d'assets aviation)
  html = html.replace(
    /!\[([^\]]*)\]\((http:\/\/localhost:8000\/api\/aviation-assets\/asset\/[^)]+)\)/g,
    (match, alt, src) => {
      const assetId = src.split('/').pop();
      return `<div class="aviation-thumbnail-container inline-block my-2" data-src="${src}" data-alt="${alt}" data-asset-id="${assetId}"></div>`;
    }
  );

  // Liens
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Retours à la ligne
  html = html.replace(/\n/g, '<br>');

  return html;
}

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

export default function QuestionDetailsDialog({
  questionId,
  children,
  onClose
}: QuestionDetailsDialogProps) {
  const { getToken, user } = useAuth();
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${questionId}`,
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

  const getCountryList = (countries: Record<string, Record<string, string[]>> | string[]) => {
    return Array.isArray(countries) ? countries : Object.keys(countries);
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
            <TabsList className="grid w-full grid-cols-4 gap-2 p-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Eye className="w-4 h-4" />
                <span className="font-medium">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="explanation"
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Explanation</span>
              </TabsTrigger>
              <TabsTrigger 
                value="comments"
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">Comments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preview"
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Info className="w-4 h-4" />
                <span className="font-medium">Review</span>
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
                <div className="space-y-6 max-h-[calc(80vh-8rem)] overflow-y-auto pr-2">
                  <div className="relative">
                    {/* Decorative gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-blue-50 dark:from-emerald-950/10 dark:to-blue-950/10 rounded-2xl -z-10"></div>
                    
                    <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg">
                          <Info className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Question Availability</h3>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Available in:</p>
                        <div className="flex flex-wrap gap-2">
                          {getCountryList(details.countries).map((country, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 hover:scale-105 transition-transform"
                            >
                              🌍 {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
  const formattedQuestion = formatMarkdown(details.question_text);

  return (
    <Card className="p-6 max-h-[calc(80vh-8rem)] overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div 
              className="text-xl font-semibold leading-relaxed text-gray-900 dark:text-gray-100 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formattedQuestion }}
            />
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {details.is_correct !== null && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  details.is_correct
                    ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30'
                    : 'bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    details.is_correct ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-sm font-semibold ${
                    details.is_correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {details.is_correct ? 'Correct Answer' : 'Incorrect Answer'}
                  </span>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></div>
          Answer Options
        </h4>
        <div className="grid gap-3">
          {details.options ? (
            Object.entries(details.options).map(([key, value]) => {
              const isUserAnswer = details.user_answer === key;
              const isCorrectAnswer = details.answer === key;

              let optionStyle = '';
              let badgeStyle = '';
              let iconStyle = '';
              
              if (isUserAnswer && details.is_correct) {
                // User's answer and it's correct - green
                optionStyle = 'border-emerald-500 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/20';
                badgeStyle = 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
                iconStyle = 'text-emerald-600 dark:text-emerald-400';
              } else if (isUserAnswer && !details.is_correct) {
                // User's answer but it's incorrect - red
                optionStyle = 'border-red-500 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/20 shadow-md shadow-red-200/50 dark:shadow-red-900/20';
                badgeStyle = 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
                iconStyle = 'text-red-600 dark:text-red-400';
              } else if (isCorrectAnswer) {
                // Not user's answer but it's the correct one - green
                optionStyle = 'border-emerald-500 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/20';
                badgeStyle = 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
                iconStyle = 'text-emerald-600 dark:text-emerald-400';
              } else {
                // Neutral answer
                optionStyle = 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50';
                badgeStyle = 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
                iconStyle = 'text-gray-400 dark:text-gray-500';
              }

              return (
                <div
                  key={key}
                  className={`relative group flex items-center p-4 rounded-xl border-2 transition-all ${optionStyle}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 font-bold text-sm transition-transform ${badgeStyle}`}>
                      {key}
                    </div>
                    <span 
                      className="text-gray-900 dark:text-gray-100 flex-1 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(value) }}
                    />
                  </div>

                  {(isUserAnswer || isCorrectAnswer) && (
                    <div className="absolute right-4 flex items-center gap-2">
                      {isUserAnswer && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                          <div className={`w-2 h-2 rounded-full ${isCorrectAnswer ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Your answer
                          </span>
                        </div>
                      )}
                      {isCorrectAnswer && !isUserAnswer && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            Correct
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-center py-8">No options available</div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ExplanationTab({ explanation }: { explanation: string }) {
  const formattedExplanation = formatMarkdown(explanation);

  return (
    <div className="space-y-6 max-h-[calc(80vh-8rem)] overflow-y-auto pr-2">
      <div className="relative">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 dark:from-blue-950/10 dark:to-purple-950/10 rounded-2xl -z-10"></div>
        
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Detailed Explanation
            </h3>
          </div>

          <div 
            className="text-gray-700 dark:text-gray-300 leading-relaxed break-words prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formattedExplanation }}
          />
        </div>
      </div>

      {/* Pro Tip Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Pro Tip</p>
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Take notes and review this explanation multiple times for better retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentsTab({ questionId }: { questionId: number }) {
  const { user } = useAuth();

  return (
    <Card className="p-6 max-h-[calc(80vh-8rem)] overflow-y-auto">
      <CommentsQuizz
        questionId={questionId}
        userId={user?.id || ''}
      />
    </Card>
  );
}