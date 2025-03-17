/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from 'react';
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
import { Card, UserButton } from './_components/ui';
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

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

function App() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  if (loading || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader />
      </div>
    );
  }

  const validTopics = data.topics.filter(topic => 
    !topic.topic_name.toLowerCase().includes('test') && 
    topic.topic_name !== 'Removed' &&
    !topic.topic_name.match(/^[0-9]+$/)
  );

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

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
              <UserButton 
                username={data.user.username || "Unknown User"} 
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Questions Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-white p-6"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-white p-6"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-white p-6"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-white p-6"
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topics Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Training Topics</h2>
            <div className="grid grid-cols-1 gap-4">
              {validTopics.map((topic, index) => (
                <motion.div
                  key={topic.topic_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {String(topic.topic_id).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {topic.topic_name}
                      </p>
                      <div className="mt-1 flex items-center">
                        <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${topic.score * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-xs text-slate-500">
                          {(topic.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Latest Article and Topics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Latest Article */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1a1a2e]">Dernier Article</h3>
                  <Newspaper className="w-5 h-5 text-[#EECE84]" />
                </div>
                <div className="space-y-4">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img 
                      src={data.latestArticle.image} 
                      alt={data.latestArticle.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(data.latestArticle.pubDate), 'PPP')}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-[#1a1a2e] mb-4">{data.latestArticle.title}</h4>
                    <div 
                      className="prose prose-sm max-w-none text-gray-600 overflow-y-auto max-h-[400px] pr-4"
                      dangerouslySetInnerHTML={{ 
                        __html: data.latestArticle.content
                      }}
                    />

                    <button
                      onClick={() => router.push('/latest_news')}
                      className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none transition-colors duration-200"
                    >
                      Lire la suite
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;