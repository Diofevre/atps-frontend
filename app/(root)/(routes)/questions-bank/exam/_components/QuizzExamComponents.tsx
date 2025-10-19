'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth, useUser } from '@/lib/mock-clerk';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react'; // Import useRef
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import HeaderExam from './HeaderExam';
import { TimeExpiredModal } from '../_components/TimeExpiredModal';
import SidebarExam from './SidebarExam';
import QuestionOptionExam from './QuestionOptionExam';
import FooterExamState from './FooterExam';

interface RawQuestionData {
  id: number;
  question_text: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  sub_chapter_id: number;
  countries: string[];
}

interface RawQuestionResponse {
  dataValues: RawQuestionData;
}

interface Question {
  id: number;
  questionText: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  subChapterId: number;
  countries: string[];
}

interface UserAnswer {
  question_id: number;
  user_answer: string;
}

const QuizzComponents = () => {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  // Use a ref to hold the timeRemaining value to prevent re-renders from resetting the timer
  const timeRemainingRef = useRef<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    if (typeof window === 'undefined') return 3600; // Server-side rendering case

    const urlParams = new URLSearchParams(window.location.search);
    const duration = urlParams.get('duration');
    let initialTime = 3600; // Default duration

    if (duration && typeof duration === 'string') {
      const [hours, minutes, seconds] = duration.split(':').map(Number);
      initialTime = (hours * 3600) + (minutes * 60) + (seconds || 0);
    }

    // Attempt to get previously saved remaining time from localStorage
    const savedTime = localStorage.getItem('examRemainingTime');
    if (savedTime) {
      const parsedTime = parseInt(savedTime, 10);
      initialTime = Math.max(0, parsedTime); // Ensure the time isn't negative
    }

    timeRemainingRef.current = initialTime; // Initialize the ref
    return initialTime;
  });


  const [examId, setExamId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTimeExpiredModal, setShowTimeExpiredModal] = useState(false);
  const [isExamSubmitting, setIsExamSubmitting] = useState(false);
  const [topicName, setTopicName] = useState<string>('');

  const animationVariants = {
    enter: { opacity: 0, x: -100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  // Clear localStorage only once when component mounts
  useEffect(() => {
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('answeredQuestions');
    // No longer remove examEndTime.  We need to persist across refreshes

    return () => {
      // Cleanup localStorage on unmount (optional)
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('answeredQuestions');
    }
  }, []);

  const handleValidateExam = useCallback(async () => {
    if (isExamSubmitting) return;

    setIsExamSubmitting(true);
    const token = await getToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          exam_id: examId,
          filter: null,
          data: userAnswers.map(answer => ({
            question_id: answer.question_id,
            user_answer: answer.user_answer
          }))
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Error completing exam');
      }

      const data = await response.json();

      // Store validation data in localStorage to avoid duplicate API call
      localStorage.setItem('validationData', JSON.stringify(data));

      toast.success('Exam submitted successfully.')
      router.push(`/questions-bank/exam/review?examId=${examId}`);
      return data;
    } catch (error) {
      console.error('Error completing exam:', error);
      toast.error('Failed to complete exam');
      setIsExamSubmitting(false);
    }
  }, [examId, getToken, isExamSubmitting, router, userAnswers]);

  useEffect(() => {
    const initializeExam = async () => {
      const token = await getToken();
      const topicId = searchParams.get('id');
      const existingExamId = searchParams.get('examId');

      if (!user?.id) {
        console.error("User not connected or invalid ID");
        return;
      }

      try {
        let response;

        if (existingExamId) {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/exams/reinit`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                exam_id: parseInt(existingExamId)
              }),
            }
          );
        } else if (topicId) {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/exams/create`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                topicId: parseInt(topicId),
                filters: {
                  countries: null,
                  question_not_seen: false,
                  wrong_answer: false,
                  last_exam: null
                }
              }),
            }
          );
        } else {
          throw new Error("No topic ID or exam ID provided");
        }

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.message || 'Error initializing exam');
        }

        const responseData = await response.json();
        setExamId(responseData.exam_id);
        setTopicName(responseData.topic_name || '');

        const formattedQuestions: Question[] = responseData.questions.map(
          (question: RawQuestionResponse) => {
            const dataValues = question.dataValues;
            return {
              id: dataValues.id,
              questionText: dataValues.question_text,
              answer: dataValues.answer,
              options: dataValues.options,
              explanation: dataValues.explanation,
              subChapterId: dataValues.sub_chapter_id,
              countries: dataValues.countries,
            };
          }
        );

        console.log("Formatted Questions:", formattedQuestions);
        setQuestions(formattedQuestions);

        const duration = searchParams.get('duration');
        let initialTime = 3600; // Default duration

        if (duration && typeof duration === 'string') {
          const [hours, minutes, seconds] = duration.split(':').map(Number);
          initialTime = (hours * 3600) + (minutes * 60) + (seconds || 0);
        }

        // set time remaining if available in local storage
        const savedTime = localStorage.getItem('examRemainingTime');
        if (savedTime) {
          const parsedTime = parseInt(savedTime, 10);
          initialTime = Math.max(0, parsedTime); // Ensure the time isn't negative
        }

        timeRemainingRef.current = initialTime;
        setTimeRemaining(initialTime)


      } catch (error) {
        console.error('API Error:', error);
        toast.error('Error initializing exam');
        router.push('/questions-bank/exam');
      } finally {
        setLoading(false);
      }
    };

    initializeExam();
  }, [getToken, searchParams, user, router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !loading && timeRemainingRef.current > 0 && !isExamSubmitting) {
      const interval = setInterval(() => {
        // Use the ref to get the latest time
        let remainingTime = timeRemainingRef.current;

        if (remainingTime > 0) {
          remainingTime -= 1;

          timeRemainingRef.current = remainingTime;
          setTimeRemaining(remainingTime)

          localStorage.setItem('examRemainingTime', remainingTime.toString());


        } else {
          clearInterval(interval);
          setShowTimeExpiredModal(true);
          handleValidateExam();
          localStorage.removeItem('examRemainingTime');
          setTimeRemaining(0);
        }

      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading, handleValidateExam, isExamSubmitting]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  const handleAnswer = (questionId: number, userAnswer: string) => {
    setUserAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.question_id === questionId);
      if (existingAnswerIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { question_id: questionId, user_answer: userAnswer };
        return newAnswers;
      }
      return [...prev, { question_id: questionId, user_answer: userAnswer }];
    });

    setAnsweredQuestions(prev => Array.from(new Set([...prev, currentQuestionIndex])));
    setTimeout(goToNextQuestion, 500);
  };

  const handleSubmitReport = async (report: { userId: string; categorie: string; contenu: string }) => {
    if (timeRemaining <= 0 || isExamSubmitting) return;

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
        <p>No questions found for this exam.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      return (
        <div className="flex h-screen items-center justify-center">
          <p>No current question.</p>
        </div>
      );
    }
  const formattedText = currentQuestion?.questionText
    ? currentQuestion.questionText
      .replace(/\n/g, "<br />")
      .replace(/\t/g, " ")
    : "";

  return (
    <div className="flex flex-col min-h-screen">
      <TimeExpiredModal
        isOpen={showTimeExpiredModal}
        onClose={() => setShowTimeExpiredModal(false)}
      />

      <HeaderExam
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeSpent={formatTime(timeRemaining)}
        onPreviousQuestion={goToPreviousQuestion}
        onNextQuestion={goToNextQuestion}
        onSubmitReport={handleSubmitReport}
        currentQuestionId={currentQuestion.id}
        userId={user?.id}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 mt-[76px] mb-[64px]">
        <div className="max-w-[1260px] mx-auto px-4 h-full">
          <div className="flex flex-col lg:flex-row relative h-full">
            <div className="flex-1 lg:max-w-[calc(100%-400px)] w-full">
              <div className="py-6">
                <motion.div
                  key={currentQuestionIndex}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="space-y-6 mb-6"
                >
                  <div
                    className="text-[18px] leading-tight"
                    dangerouslySetInnerHTML={{ __html: formattedText }}
                  />
                  <QuestionOptionExam
                    options={currentQuestion?.options}
                    currentQuestionIndex={currentQuestionIndex}
                    questionId={currentQuestion.id}
                    answeredQuestions={answeredQuestions}
                    handleAnswer={handleAnswer}
                    examId={examId}
                  />
                </motion.div>
              </div>
            </div>

            <aside className="w-full lg:w-[280px] lg:fixed 2xl:right-[max(0px,calc((100vw-1255px)/2+16px))] xl:right-[max(0px,calc((100vw-1250px)/2+16px))] lg:right-[max(0px,calc((100vw-1040px)/2+16px))] lg:top-[90px]">
              <div className="py-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <SidebarExam
                    totalQuestions={questions.length}
                    currentQuestionIndex={currentQuestionIndex}
                    onNavigateToQuestion={setCurrentQuestionIndex}
                    answeredQuestions={answeredQuestions}
                    isOpen={isSidebarOpen}
                    onOpenChange={setIsSidebarOpen}
                    onValidate={handleValidateExam}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <FooterExamState
        topicName={topicName}
      />
    </div>
  );
}

export default QuizzComponents;