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
  Activity
} from 'lucide-react';
import { useAuth } from '@/lib/mock-clerk';
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from 'swr';

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
    id: number;
    title: string;
    content: string;
    image_url?: string;
    created_at: string;
  };
}

const DashboardNew = () => {
  const { user } = useAuth();
  const router = useRouter();

  const { data: dashboardData, error, isLoading } = useSWR<DashboardData>(
    '/api/dashboard',
    async (url: string) => {
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    }
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Error Loading Dashboard</h2>
          <p className="text-gray-500">Please try refreshing the page.</p>
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
            Welcome back, {dashboardData.user.username}! 👋
          </h1>
        </motion.div>

        {/* Section 2 - News & Articles Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* News Card - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => router.push(`/articles/${dashboardData.latestArticle.id}`)}
          >
            <div className="flex h-64">
              {/* Image Thumbnail - Left */}
              <div className="w-1/2 relative">
                <img
                  src={dashboardData.latestArticle.image_url || '/features/Nuage.png'}
                  alt={dashboardData.latestArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-700">CSA CZECH AIRLINES</span>
                  </div>
                </div>
              </div>
              
              {/* Content - Right */}
              <div className="w-1/2 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {dashboardData.latestArticle.title}
                </h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(dashboardData.latestArticle.created_at), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Article Card - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <div className="p-6 h-64 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                Avenue Genius: Why Czech Shut Down in Aviation
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm mb-4">
                Czech Airlines faced significant financial struggles, regulatory compliance challenges, 
                and technological adoption issues. The company struggled with intense competition 
                and made strategic missteps that led to its eventual closure in the aviation industry.
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <span>Read more</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 3 - Performance & Reports Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Air Law Performance Card - Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Air Law</h3>
              <Expand className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
            
            {/* Donut Chart */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-yellow-400"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray="90, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">90%</div>
                    <div className="text-sm text-gray-500">Performance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">90%</div>
                  <div className="text-xs text-gray-500">General mark</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">1,298</div>
                  <div className="text-xs text-gray-500">Questions completed</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Questions Report Card - Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Questions Report</h3>
              <select className="text-sm text-gray-500 bg-transparent border-none outline-none">
                <option>Yearly</option>
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Questions in 2024</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">9,107</span>
                <span className="text-sm text-yellow-500 font-medium">+2.3%</span>
              </div>
            </div>

            {/* Line Chart */}
            <div className="h-32 relative">
              <svg className="w-full h-full" viewBox="0 0 300 100">
                <polyline
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  points="10,80 30,75 50,60 70,45 90,35 110,30 130,25 150,20 170,25 190,30 210,35 230,40 250,45 270,50 290,55"
                />
                {/* Data points */}
                <circle cx="150" cy="20" r="3" fill="#8b5cf6" />
                <circle cx="170" cy="25" r="3" fill="#8b5cf6" />
                <circle cx="190" cy="30" r="3" fill="#8b5cf6" />
                {/* Tooltip */}
                <rect x="140" y="10" width="60" height="20" fill="#000" rx="4" />
                <text x="170" y="23" textAnchor="middle" fill="white" fontSize="10">897 orders</text>
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
                <span>JAN</span>
                <span>MAR</span>
                <span>MAY</span>
                <span>JUL</span>
                <span>SEP</span>
                <span>NOV</span>
                <span>DEC</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 4 - Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Black */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Training Progress</h4>
                <p className="text-gray-300 text-sm">Advanced courses completed</p>
              </div>
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Card 2 - Purple */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-purple-500 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Code Practice</h4>
                <p className="text-purple-100 text-sm">Technical assessments</p>
              </div>
              <Code className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Card 3 - Green */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-green-500 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Activity</h4>
                <p className="text-green-100 text-sm">Daily study streak</p>
              </div>
              <Activity className="w-8 h-8 text-white" />
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

export default DashboardNew;
