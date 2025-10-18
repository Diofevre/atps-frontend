'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock, Target, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useUser } from '@/lib/mock-clerk';
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from 'swr';
import { motion } from "framer-motion";
import ErrorHandler from '@/components/error';

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

interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string | number;
  subtitle: string;
  delay: number;
}

const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    headers: { 
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch test data.');
  }
  return response.json();
};

const StatCard = ({ icon: Icon, title, value, subtitle, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-500">
      <div className="p-8 bg-gradient-to-br from-[#EECE84]/5 to-white">
        <Icon className="w-10 h-10 text-[#EECE84] mb-4 group-hover:scale-110 transition-transform duration-500" />
        <h3 className="text-base font-medium text-gray-500">{title}</h3>
        <p className="text-4xl font-semibold text-gray-800 mt-2 group-hover:scale-105 transition-transform">
          {value}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {subtitle}
        </p>
      </div>
    </Card>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#EECE84]/5 via-white to-[#EECE84]/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-8">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-8">
            <Skeleton className="h-10 w-10 mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </div>
      <div className="flex justify-center mb-12">
        <Skeleton className="h-14 w-48" />
      </div>
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const Resume = () => {
  const { user } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  
  const { data: testData, error } = useSWR<TestResume>(
    user?.id ? [`${process.env.NEXT_PUBLIC_API_URL}/api/tests/resumeTest`, user.id] : null,
    async () => {
      const token = await getToken();
      return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/api/tests/resumeTest`, token as string);
    }
  );

  const handleContinueTest = () => {
    if (testData?.test_id) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('timeSpents', testData.timespent);
      }
      router.push(`/questions-bank/study/quizz?testId=${testData.test_id}&fromResume=true`);
    }
  };

  if (!testData && !error) {
    return <LoadingSkeleton />;
  }

  if (error || !testData) {
    return (
      <ErrorHandler 
        title='Test Data'
        link='questions-bank'
        link_title='Questions Bank'
      />
    );
  }

  const completionRate = Math.round((testData.questions.length / testData.total_question) * 100);
  const correctAnswers = testData.questions.filter(q => q.is_correct).length;
  const accuracy = Math.round((correctAnswers / testData.questions.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EECE84]/5 via-white to-[#EECE84]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <Link 
            href="/questions-bank" 
            className="group inline-flex items-center text-xl font-medium text-gray-600 hover:text-gray-900"
          >
            <span className="mr-2 text-2xl leading-none select-none">⟵</span>
            Questions Bank
          </Link>
        </motion.div>

        <div className="space-y-16">  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              icon={Clock}
              title="Time Spent"
              value={testData.timespent}
              subtitle="Try to do your best"
              delay={0.1}
            />
            
            <StatCard
              icon={Target}
              title="Completion"
              value={`${completionRate}%`}
              subtitle={`${testData.questions.length} of ${testData.total_question} questions`}
              delay={0.2}
            />
            
            <StatCard
              icon={CheckCircle2}
              title="Current Accuracy"
              value={`${accuracy}%`}
              subtitle={`${correctAnswers} correct of ${testData.questions.length} answered`}
              delay={0.3}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleContinueTest}
              className="bg-[#EECE84] hover:bg-[#EECE84]/90 text-black/90 px-12 py-7 rounded-full text-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              Continue Test
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Questions Answered</h2>
            <div className="space-y-6">
              {testData.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <div className="p-8">
                      <div className="flex items-start gap-6">
                        {question.is_correct ? (
                          <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        )}
                        <div className="flex-grow">
                          <p className="text-gray-800 text-lg font-medium mb-3">{question.question_text}</p>
                          <div className={`inline-block px-5 py-2.5 rounded-full text-base font-medium transition-all duration-300 ${
                            question.is_correct 
                              ? 'bg-green-100 text-green-700 group-hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 group-hover:bg-red-200'
                          }`}>
                            {question.user_answer}
                          </div>
                        </div>
                        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-base font-medium text-gray-600 group-hover:bg-[#EECE84]/20 transition-colors">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Resume;