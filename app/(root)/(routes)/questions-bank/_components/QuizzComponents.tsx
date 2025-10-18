/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuth, useUser } from '@/lib/mock-clerk';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import HeaderState from './Header';
import Explanation from './ExplanationQuizz';
import CommentsQuizz from './CommentsQuizz';
import ReviewForm from './ReviewForm';
import SidebarCard from './Sidebar';
import FooterState from './Footer';
import QuestionOptions from './QuestionOptionsQuizz';
import AIChat from './AIChats';

interface QuizData {
  topic_name?: string;
  chapters: string[];
  subChapters: string[];
  questionCount: number;
  userId: string;
  testId: number | null;
  tryagainfilter: string | null;
  nombre_question: number;
  total_question: number;
  filter: {
    countries: string | null;
    question_not_seen: boolean;
    green_tag: boolean;
    red_tag: boolean;
    orange_tag: boolean;
    wrong_answer: boolean;
    last_exam: number;
  };
}

interface RawQuestion {
  id: number;
  question_text: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  sub_chapter_id: number;
  countries: Record<string, Record<string, string[]>>;
  chatExplanations?: {
    id: number;
    explanation: string;
  }[];
  explanation_images: string | null;
  question_images: string | null;
  quality_score: string;
}

interface Question {
  id: number;
  questionText: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  subChapterId: number;
  countries: Record<string, Record<string, string[]>>;
  chatExplanations?: {
    id: number;
    explanation: string;
  }[];
  explanation_images: string | null;
  question_images: string | null;
  quality_score: string;
}


interface AnsweredQuestion {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

interface QuestionResponse {
  id: number;
  user_answer: string;
}

const QuizzComponents = () => {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('currentQuestionIndex');
      return savedIndex ? parseInt(savedIndex, 10) : 0;
    }
    return 0;
  });
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>(() => {
    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem('answeredQuestions');
      return savedAnswers ? JSON.parse(savedAnswers) : [];
    }
    return [];
  });
  const [selectedContent, setSelectedContent] = useState(0);
  const [timeSpents, setTimeSpents] = useState(0);
  const [testId, setTestId] = useState<number | null>(null);
  const [pinnedQuestions, setPinnedQuestions] = useState<Record<number, string[]>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [topicName, setTopicName] = useState<string>('');

  const animationVariants = {
    enter: { opacity: 0, x: -100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  // Convert HH:MM:SS to seconds
  const timeStringToSeconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTime = localStorage.getItem('timeSpents');
      setTimeSpents(storedTime ? parseInt(storedTime, 10) : 0);
  
      const interval = setInterval(() => {
        setTimeSpents((prev) => {
          const newTime = prev + 1;
          if (typeof window !== 'undefined') {
            localStorage.setItem('timeSpents', newTime.toString());
          }
          return newTime;
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = await getToken();
      const testIdFromUrl = searchParams.get('testId');
      const isFromHistory = searchParams.get('fromHistory') === 'true';
      const isFromResume = searchParams.get('fromResume') === 'true';
      const data = searchParams.get('data');
  
      if (!user?.id) {
        console.error("User not connected or invalid ID");
        return;
      }
  
      try {
        if ((isFromHistory || isFromResume) && testIdFromUrl) {
          const endpoint = isFromResume 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/tests/resumeTest`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/tests/continueTest/${testIdFromUrl}`;

          const response = await fetch(endpoint, {
            headers: { 
              'Authorization': `Bearer ${token}`,
            }
          });

          if (!response.ok) {
            throw new Error('Error fetching test data');
          }
  
          const responseData = await response.json();
          setTopicName(responseData.topic_name || '');
          setTestId(parseInt(testIdFromUrl));
  
          // Handle saved timespent
          if (responseData.timespent) {
            const savedSeconds = timeStringToSeconds(responseData.timespent);
            if (typeof window !== 'undefined') {
              localStorage.setItem('timeSpents', savedSeconds.toString());
            }
            setTimeSpents(savedSeconds);
          }

          const formattedQuestions: Question[] = responseData.questions.map(
            (question: RawQuestion) => ({
              id: question.id,
              questionText: question.question_text,
              answer: question.answer,
              options: question.options,
              explanation: question.explanation,
              subChapterId: question.sub_chapter_id,
              countries: question.countries,
              question_images: question.question_images,
              explanation_images: question.explanation_images,
              quality_score: question.quality_score,
              chatExplanations: question.chatExplanations,
            })
          );

          setQuestions(formattedQuestions);
          
          if (responseData.questions) {
            const answeredQuestionsData = responseData.questions
              .filter((q: QuestionResponse) => q.user_answer)
              .map((q: QuestionResponse) => {
                const question = formattedQuestions.find(fq => fq.id === q.id);
                return {
                  questionId: q.id,
                  userAnswer: q.user_answer,
                  isCorrect: q.user_answer === question?.answer,
                  correctAnswer: question?.answer || ''
                };
              });
            setAnsweredQuestions(answeredQuestionsData);
          }
  
          if (responseData.current_question_index !== undefined) {
            setCurrentQuestionIndex(responseData.current_question_index);
          }
  
        } else if (data) {
          const quizData: QuizData = JSON.parse(decodeURIComponent(data));
          
          const bodyData = {
            userId: user.id,
            testId: quizData.testId || null,
            tryagainfilter: quizData.tryagainfilter || null,
            total_question: quizData.total_question || quizData.questionCount,
            nombre_question: quizData.nombre_question || quizData.questionCount,
            sub_chapters: quizData.subChapters?.map(subChapter => parseInt(subChapter, 10)) || [],
            filter: {
              ...quizData.filter,
              countries: null,
              question_not_seen: false,
              green_tag: false,
              red_tag: false,
              orange_tag: false,
              wrong_answer: false,
              last_exam: null
            }
          };
  
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/tests/start`,
            {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
              },
              body: JSON.stringify(bodyData),
            }
          );
  
          if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || 'Error fetching questions');
          }
  
          const responseData = await response.json();
          setTopicName(responseData.topic_name || '');
          setTestId(responseData.test_id);
  
          const formattedQuestions: Question[] = responseData.questions.map(
            (question: RawQuestion) => ({
              id: question.id,
              questionText: question.question_text,
              answer: question.answer,
              options: question.options,
              explanation: question.explanation,
              subChapterId: question.sub_chapter_id,
              countries: question.countries,
              chatExplanations: question.chatExplanations,
              explanation_images: question.explanation_images,
              question_images: question.question_images,
              quality_score: question.quality_score,
            })
          );
  
          setQuestions(formattedQuestions);
        } else {
          console.error("No 'data' parameter or testId found in request");
        }
      } catch (error) {
        console.error('API Error:', error);
        toast.error('Error loading quiz data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuestions();
  }, [getToken, searchParams, user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
    }
  }, [currentQuestionIndex]);

  const goToPreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => Math.min(questions.length - 1, prevIndex + 1));
  }, [questions.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPreviousQuestion();
      } else if (event.key === 'ArrowRight') {
        goToNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextQuestion, goToPreviousQuestion]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
    }
  }, [answeredQuestions]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading user information...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>No questions found for the selected chapters and sub-chapters.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleContentChange = (index: number): void => {
    setSelectedContent(index);
  };

  const handleAnswer = (questionId: number, userAnswer: string) => {
    setAnsweredQuestions((prev) => {
      const newAnswers = [
        ...prev.filter((q) => q.questionId !== questionId),
        { 
          questionId, 
          userAnswer, 
          isCorrect: userAnswer === questions.find(q => q.id === questionId)?.answer,
          correctAnswer: questions.find(q => q.id === questionId)?.answer || ''
        }
      ];
      if (typeof window !== 'undefined') {
        localStorage.setItem('answeredQuestions', JSON.stringify(newAnswers));
      }
      return newAnswers;
    });

    setTimeout(goToNextQuestion, 500);
  };

  const handleStartReview = async () => {
    const token = await getToken();
  
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('answeredQuestions');
      }
    
      const validationData = {
        testId: testId,
        filter: null,
        data: answeredQuestions.map(({ questionId, userAnswer }) => ({
          question_id: questionId,
          user_answer: userAnswer
        }))
      };
    
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests/validate`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(validationData),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error validating test:", errorDetails);
        throw new Error(errorDetails.message || 'Error validating test.');
      }
  
      const validationResponse = await response.json();
      
      // Store validation data in localStorage to avoid duplicate API call
      if (typeof window !== 'undefined') {
        localStorage.setItem('validationData', JSON.stringify(validationResponse));
      }
      
      toast.success('Test submitted successfully.')
      router.push(`/questions-bank/study/review?testId=${validationResponse.testId}`);
    } catch (error) {
      console.error('Error during test validation:', error);
      toast.error('An error occurred during test validation.');
    }
  };

  const togglePinQuestion = async (questionId: number, color: string) => {
    const token = await getToken();

    try {
      const currentColors = pinnedQuestions[questionId] || [];
      const isPinned = currentColors.includes(color);

      const updatedColors = isPinned
        ? currentColors.filter((c) => c !== color)
        : [...currentColors, color];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/pin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testId: testId,
            userId: user?.id,
            question_id: questionId,
            is_pinned: color,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error changing pin state');
      }

      setPinnedQuestions((prev) => ({
        ...prev,
        [questionId]: updatedColors,
      }));
    } catch (error) {
      console.error('Error pinning question:', error);
    }
  };

  const handleSubmitReport = async (report: { userId: string; categorie: string; contenu: string }) => {
    const token = await getToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
        method: "POST",
        headers: { 
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      toast.success("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    }
  };

  const handleSaveTest = async () => {
    const token = await getToken();

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('answeredQuestions');
      }
    
      const saveData = {
        testId: testId,
        data: answeredQuestions.map(({ questionId, userAnswer }) => ({
          question_id: questionId,
          user_answer: userAnswer
        }))
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests/saveTest`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(saveData),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("API error during test saving:", errorDetails);
        throw new Error(errorDetails.message || 'Error during test saving.');
      }
      
      toast.success('Test saved successfully.')
      router.push(`/questions-bank/history`);
    } catch (error) {
      console.error('Error saving the test:', error);
      toast.error('Failed to save test. Please try again.');
    }
  };
  
  const formattedText = currentQuestion?.questionText
    ?.replace(/\n/g, "<br />")
    ?.replace(/\t/g, " ") || "";

  const formattedExplanation = currentQuestion?.explanation
    ?.replace(/\n/g, "<br />")
    ?.replace(/\t/g, " ") || "";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <HeaderState
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          timeSpent={timeSpents}
          onPreviousQuestion={goToPreviousQuestion}
          onNextQuestion={goToNextQuestion}
          onPinQuestion={togglePinQuestion}
          onSubmitReport={handleSubmitReport}
          pinnedQuestions={pinnedQuestions}
          currentQuestionId={currentQuestion?.id}
          userId={user?.id}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-[76px] mb-[64px]">
        <div className="max-w-[1260px] mx-auto px-4 h-full">
          <div className="flex flex-col lg:flex-row relative h-full">
            {/* Main Content Area */}
            <div className="flex-1 lg:max-w-[calc(100%-400px)] w-full">
              <div className="py-6">
                {selectedContent === 0 && (
                  <motion.div
                    key={currentQuestionIndex}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={animationVariants}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 mb-6"
                  >
                    {/* Question Text */}
                    <div
                      className="text-[18px] leading-tight"
                      dangerouslySetInnerHTML={{ __html: formattedText }}
                    />

                    {currentQuestion && (
                      <QuestionOptions
                        options={currentQuestion.options}
                        currentQuestionIndex={currentQuestionIndex}
                        questionId={currentQuestion.id}
                        answeredQuestions={answeredQuestions}
                        handleAnswer={handleAnswer}
                        currentQuestion={currentQuestion}
                      />
                    )}
                  </motion.div>
                )}

                {selectedContent === 1 && currentQuestion && (
                  <div className="lg:pr-[300px]">
                    <Explanation 
                      explanation={formattedExplanation} 
                      questionId={currentQuestion.id}
                      chatExplanations={currentQuestion.chatExplanations}
                      explanation_images={currentQuestion.explanation_images}
                    />
                  </div>
                )}

                {selectedContent === 2 && currentQuestion && (
                  <div className="max-w-[1280px] mx-auto p-8 text-center">
                    <AIChat questionId={currentQuestion.id} />
                  </div>
                )}

                {selectedContent === 3 && currentQuestion && (
                  <CommentsQuizz 
                    questionId={currentQuestion.id} 
                    userId={user?.id || ''} 
                  />
                )}

                {selectedContent === 4 && currentQuestion && (
                  <div className="p-8 mb-6">
                    <div className="max-w-2xl mx-auto">
                      <div className="mb-8 max-w-[620px] mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Review Question</h2>
                        <p className="text-gray-600 text-lg">
                          Help us improve by providing your feedback on this question.
                        </p>
                      </div>

                      {/* Countries */}
                      <div className="flex flex-wrap gap-2 mb-6 max-w-[620px] mx-auto">
                        {Object.entries(currentQuestion.countries).map(([country, years]) => (
                          <div key={country} className="group relative">
                            <div className="px-4 py-2 rounded-full bg-[#EECE84]/50 text-sm font-medium text-black border border-[#EECE84]/40 hover:bg-[#EECE84]/20 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                              <span className="flex items-center gap-2 text-xs">
                                {country}
                                {/* <span className="text-xs text-gray-500">
                                  ({Object.keys(years).length} sessions)
                                </span> */}
                              </span>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50">
                              <div className="bg-white rounded-lg shadow-xl p-4 text-sm min-w-[250px] border border-gray-200/50">
                                <div className="font-medium text-gray-900 mb-2 pb-2 border-b">
                                  {country} Exam Sessions
                                </div>
                                {Object.entries(years).map(([year, dates]) => (
                                  <div key={year} className="mb-2">
                                    <span className="font-medium text-[#EECE84]">{year}:</span>
                                    <div className="mt-1 text-gray-600 flex flex-wrap gap-1">
                                      {dates.map((date, index) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 rounded-md bg-gray-50 text-xs"
                                        >
                                          {date}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <ReviewForm
                        questionId={currentQuestion.id}
                        userId={user.id}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[280px] lg:fixed 2xl:right-[max(0px,calc((100vw-1255px)/2+16px))] xl:right-[max(0px,calc((100vw-1250px)/2+16px))] lg:right-[max(0px,calc((100vw-1040px)/2+16px))] lg:top-[90px]">
              <div className="py-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <SidebarCard
                    totalQuestions={questions.length}
                    currentQuestionIndex={currentQuestionIndex}
                    questions={questions}
                    onNavigateToQuestion={setCurrentQuestionIndex}
                    answeredQuestions={answeredQuestions}
                    isOpen={isSidebarOpen}
                    onOpenChange={setIsSidebarOpen}
                    onValidate={handleStartReview}
                    onSave={handleSaveTest}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer - Fixed at bottom */}
      <FooterState 
        onContentChange={handleContentChange} 
        topicName={topicName}
      />
    </div>
  );
}

export default QuizzComponents;