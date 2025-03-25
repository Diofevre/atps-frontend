/* eslint-disable @next/next/no-img-element */
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Plane,
  Target,
  ChevronRight,
  Eye,
  Calendar,
  Newspaper,
} from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { Card, UserButtons } from './_components/ui';
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from 'swr';
import ErrorHandler from '@/components/error';

interface DashboardData {
  user: {
    username: string;
  };
  statistics: {
    questions: {
      total: number;
      seen: number;
      correct: number;
      incorrect: number;
      generalScore: number;
    };
    exams: {
      seen: number;
    };
    tests: {
      seen: number;
      finished: number;
      unfinished: number;
    };
  };
  topics: Array<{
    topic_id: number;
    topic_name: string;
    score: number;
  }>;
  latestArticle: {
    title: string;
    link: string;
    pubDate: string;
    image: string;
    content: string;
  };
}

const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-white p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

const TopicSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-lg animate-pulse">
    <div className="flex items-center space-x-3 flex-1">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-4 w-4" />
    </div>
  </div>
);

const ArticleSkeleton = () => (
  <Card className="p-6 bg-white animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-5 w-5" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const { data, error, isLoading } = useSWR<DashboardData>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
    async (url: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Token is null');
      }
      return fetcher(url, token);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-blue-600 bg-blue-50';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (error) {
    return (
      <ErrorHandler 
        title='Dashboard Data'
        link=''
        link_title='Homepage'
      />
    );
  }

  const validTopics = data?.topics
    .filter(topic => topic.topic_name !== null)
    .filter(topic => {
      const topicName = topic.topic_name as string;
      return !topicName.toLowerCase().includes('test') &&
        topicName !== 'Removed' &&
        !topicName.match(/^[0-9]+$/);
    }) ?? [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-slate-900">ATPS DASHBOARD</h1>
            </div>
            <div className="flex items-center gap-4">
              <UserButtons
                username={data?.user.username || "Unknown User"}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : data && (
              <>
                {/* Questions Stats */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Questions</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{data.statistics.questions.total.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">Total Questions</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-green-600 font-medium">{data.statistics.questions.correct}</span>
                        <span className="text-slate-600 ml-1">Correct</span>
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">{data.statistics.questions.incorrect}</span>
                        <span className="text-slate-600 ml-1">Incorrect</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* General Score */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Score</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-slate-900">
                      {(data.statistics.questions.generalScore * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-600">General Score</div>
                  </div>
                </motion.div>

                {/* Tests Stats */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Tests</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{data.statistics.tests.finished}</div>
                      <div className="text-sm text-slate-600">Completed Tests</div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {data.statistics.tests.unfinished} unfinished
                    </div>
                  </div>
                </motion.div>

                {/* Exams Stats */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Eye className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Exams</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-slate-900">{data.statistics.exams.seen}</div>
                    <div className="text-sm text-slate-600">Exams Viewed</div>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Topics Section */}
            <div className="lg:col-span-2">
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Training Topics</h2>
                <div className="space-y-2">
                  {isLoading ? (
                    <>
                      <TopicSkeleton />
                      <TopicSkeleton />
                      <TopicSkeleton />
                      <TopicSkeleton />
                    </>
                  ) : (
                    validTopics.map((topic) => (
                      <motion.div
                        key={topic.topic_id}
                        variants={itemVariants}
                        className="group flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {String(topic.topic_id).padStart(2, '0')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-900 flex-1">
                            {topic.topic_name}
                          </span>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(topic.score)}`}>
                            {(topic.score * 100).toFixed(0)}%
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Latest Article */}
            <motion.div variants={itemVariants}>
              {isLoading ? (
                <ArticleSkeleton />
              ) : data && (
                <Card className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Dernier Article</h3>
                    <Newspaper className="w-5 h-5 text-[#EECE84]" />
                  </div>
                  <div className="space-y-4">
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <img
                        src={data.latestArticle.image}
                        alt={data.latestArticle.title}
                        className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(data.latestArticle.pubDate), 'PPP')}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 line-clamp-2">
                        {data.latestArticle.title}
                      </h4>
                      <div
                        className="prose prose-sm max-w-none text-gray-600 overflow-y-auto max-h-[400px] pr-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                        dangerouslySetInnerHTML={{
                          __html: data.latestArticle.content
                        }}
                      />
                      <button
                        onClick={() => router.push('/latest_news')}
                        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium focus:outline-none transition-colors duration-200"
                      >
                        Lire la suite
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;