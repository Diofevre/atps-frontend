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
  TrendingUp,
  Users,
  MessageCircle,
  BarChart3,
  Expand,
  Code,
  Activity,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from 'swr';
import { useRequireAuth } from '@/hooks/useRequireAuth';

interface DashboardData {
  user: {
    username: string;
    name?: string;
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
    success: boolean;
    title: string;
    content: string;
    image?: string;
    pubDate: string;
    link: string;
  };
}

const Dashboard = () => {
  const router = useRouter();
  const { shouldShowLoading } = useRequireAuth();

  const { data: dashboardData, error, isLoading } = useSWR<DashboardData>(
    '/api/dashboard', // Use relative URL to leverage Next.js rewrites
    async (url: string) => {
      console.log('[Dashboard] Fetching from:', url);
      
      // Get token from localStorage (set during login)
      let token: string | null = null;
      try {
        const tokensStr = localStorage.getItem('keycloak_tokens');
        if (tokensStr) {
          const tokens = JSON.parse(tokensStr);
          // Check if token is expired
          if (tokens.expires_at && tokens.expires_at > Date.now()) {
            token = tokens.access_token;
          }
        }
      } catch (e) {
        console.error('[Dashboard] Error reading tokens:', e);
      }
      
      if (!token) {
        throw new Error('Not authenticated - please login again');
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('[Dashboard] Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Dashboard] Error response:', errorText);
        throw new Error(`Failed to fetch dashboard data: ${response.status} - ${errorText}`);
      }
      return response.json();
    }
  );

  if (shouldShowLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !dashboardData) {
    console.error('[Dashboard] Error or no data:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
          {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section 1 - Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {dashboardData.user?.username || dashboardData.user?.name || 'John'}! 👋
          </h1>
        </motion.div>

        {/* Section 2 - Latest Article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 cursor-pointer"
          onClick={() => window.open(dashboardData.latestArticle.link, '_blank')}
        >
          <div className="flex h-80">
            {/* Image - Left (3/8 = 37.5%) */}
            <div className="w-[37.5%] relative">
              <img
                src={dashboardData.latestArticle.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'}
                alt={dashboardData.latestArticle.title}
                className="w-full h-full object-cover"
              />
              {/* Time on image */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="text-white text-sm">
                    {dashboardData.latestArticle.pubDate ? new Date(dashboardData.latestArticle.pubDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Time not available'}
        </div>
        </div>
      </div>
    </div>
            
            {/* Content - Right (5/8 = 62.5%) */}
            <div className="w-[62.5%] px-8 py-2 flex flex-col h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                {dashboardData.latestArticle.title}
              </h3>
              
              <div 
                className="text-gray-600 leading-relaxed text-sm overflow-hidden flex-1 relative"
                style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.5rem',
                  maxHeight: 'calc(100% - 40px)'
                }}
              >
                <div 
                  className="overflow-y-auto max-h-full"
                  dangerouslySetInnerHTML={{ __html: dashboardData.latestArticle.content }}
                />
              </div>
              <style jsx global>{`
                .text-gray-600 p {
                  margin-bottom: 0.5rem !important;
                }
                .text-gray-600 strong {
                  font-weight: 600 !important;
                }
                .text-gray-600 ul, 
                .text-gray-600 ol {
                  margin-bottom: 0.5rem !important;
                  padding-left: 1.5rem !important;
                }
                .text-gray-600 li {
                  margin-bottom: 0.25rem !important;
                }
              `}</style>
              
              <div className="flex items-center text-yellow-600 text-sm font-medium pt-2">
                <span>Read more</span>
                <ChevronRight className="w-4 h-4 ml-1" />
            </div>
            </div>
          </div>
          </motion.div>

        {/* Section 3 - Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer border border-blue-100 hover:border-blue-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData.statistics.questions.total?.toLocaleString() || 0}
            </h4>
            <p className="text-sm text-gray-600">Total Questions</p>
          </motion.div>

          {/* General Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer border border-yellow-200 hover:border-yellow-400"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData.statistics.questions.generalScore?.toFixed(1) || 0}%
            </h4>
            <p className="text-sm text-gray-600">General Score</p>
          </motion.div>

          {/* Tests Completed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer border border-green-100 hover:border-green-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData.statistics.tests.finished || 0}
            </h4>
            <p className="text-sm text-gray-600">Tests Completed</p>
          </motion.div>

          {/* Exams Taken */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer border border-purple-100 hover:border-purple-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData.statistics.exams.seen || 0}
            </h4>
            <p className="text-sm text-gray-600">Exams Taken</p>
          </motion.div>
        </div>

        {/* Section 4 - Notifications & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notifications
              </h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">3 new</span>
            </div>
            <div className="space-y-4">
              {/* Sample notification 1 */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Test completed successfully</p>
                  <p className="text-xs text-gray-600 mt-1">Air Law - You scored 85%</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              {/* Sample notification 2 */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors cursor-pointer">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New content available</p>
                  <p className="text-xs text-gray-600 mt-1">New questions added to Mass & Balance</p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>

              {/* Sample notification 3 */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Study reminder</p>
                  <p className="text-xs text-gray-600 mt-1">Complete 10 more questions to reach your daily goal</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all notifications
            </button>
          </motion.div>

          {/* Recent Topics Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Topic Progress
              </h3>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {dashboardData.topics?.slice(0, 3).map((topic) => (
                <div key={topic.topic_id} className="cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{topic.topic_name}</span>
                    <span className="text-sm font-bold text-blue-600">{topic.score.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${topic.score}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
              {(!dashboardData.topics || dashboardData.topics.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">Start a quiz to see your progress</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default Dashboard;