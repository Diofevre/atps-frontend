'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useUser } from '@clerk/nextjs';
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

interface Question {
  id: number;
  question_text: string;
  user_answer: string;
  is_correct: boolean;
}

interface TestResume {
  test_id: number;
  timespent: string;
  total_question: number;
  questions: Question[];
}

const Resume = () => {
  const { user } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  const [testData, setTestData] = useState<TestResume | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    const fetchLastTest = async () => {
      const token = await getToken();
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests/resumeTest`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch test data.');
        }
        const data: TestResume = await response.json();
        setTestData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLastTest();
  }, [getToken, user]);

  const handleContinueTest = () => {
    if (testData?.test_id) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('timeSpents', testData.timespent);
      }
      router.push(`/questions-bank/study/quizz?testId=${testData.test_id}&fromResume=true`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EECE84]/10 via-white to-[#EECE84]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <Link href="/questions-bank" className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-2xl font-semibold uppercase">Resume Test</span>
            </Link>
          </div>
          <Card className="p-12 text-center bg-white/50 backdrop-blur-sm">
            <p className="text-red-500 mb-6 text-lg">{error || 'No test available to resume'}</p>
            <Button
              onClick={() => router.push('/questions-bank')}
              variant="default"
              className="bg-[#EECE84] hover:bg-[#EECE84]/90 text-black font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Start New Test
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const completionRate = Math.round((testData.questions.length / testData.total_question) * 100);
  const correctAnswers = testData.questions.filter(q => q.is_correct).length;
  const accuracy = Math.round((correctAnswers / testData.questions.length) * 100) || 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex justify-between items-center mb-8">
          <Link href="/questions-bank" className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-2xl font-semibold uppercase">Resume Test</span>
          </Link>
        </div>

        <div className="space-y-8">  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-6 bg-gradient-to-br from-[#EECE84]/20 to-[#EECE84]/5">
                <Clock className="w-8 h-8 text-[#EECE84] mb-3" />
                <h3 className="text-sm font-medium text-gray-500">Time Spent</h3>
                <p className="text-3xl font-medium text-gray-800 mt-1 group-hover:scale-105 transition-transform">
                  {testData.timespent}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Try to do your best
                </p>
              </div>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-6 bg-gradient-to-br from-[#EECE84]/20 to-[#EECE84]/5">
                <Target className="w-8 h-8 text-[#EECE84] mb-3" />
                <h3 className="text-sm font-medium text-gray-500">Completion</h3>
                <p className="text-3xl font-medium text-gray-800 mt-1 group-hover:scale-105 transition-transform">
                  {completionRate}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {testData.questions.length} of {testData.total_question} questions
                </p>
              </div>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="p-6 bg-gradient-to-br from-[#EECE84]/20 to-[#EECE84]/5">
                <CheckCircle2 className="w-8 h-8 text-[#EECE84] mb-3" />
                <h3 className="text-sm font-medium text-gray-500">Current Accuracy</h3>
                <p className="text-3xl font-medium text-gray-800 mt-1 group-hover:scale-105 transition-transform">
                  {accuracy}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {correctAnswers} correct of {testData.questions.length} answered
                </p>
              </div>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleContinueTest}
              className="bg-[#EECE84] hover:bg-[#EECE84]/90 text-black/90 px-10 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Continue Test
            </Button>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Questions Answered</h2>
            <div className="space-y-4">
              {testData.questions.map((question, index) => (
                <Card key={question.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="p-6 bg-white">
                    <div className="flex items-start gap-4">
                      {question.is_correct ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      )}
                      <div className="flex-grow">
                        <p className="text-gray-800 font-medium mb-2">{question.question_text}</p>
                        <div className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${
                          question.is_correct 
                            ? 'bg-green-100 text-green-500' 
                            : 'bg-red-100 text-red-500'
                        }`}>
                          {question.user_answer}
                        </div>
                      </div>
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;