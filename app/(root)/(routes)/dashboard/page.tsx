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
  Info,
  Clock,
  FileText,
  ChevronLeft
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
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

        {/* Section 2 - Latest Article (News) - Keep as is */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 cursor-pointer"
          onClick={() => window.open(dashboardData.latestArticle.link, '_blank')}
        >
          <div className="flex h-80 bg-white rounded-2xl border border-blue-200 shadow-lg overflow-hidden">
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
                className="text-gray-700 leading-relaxed text-sm overflow-hidden flex-1 relative"
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
                .text-gray-700 p {
                  margin-bottom: 0.5rem !important;
                  color: #374151 !important;
                }
                .text-gray-700 strong {
                  font-weight: 600 !important;
                  color: #111827 !important;
                }
                .text-gray-700 ul, 
                .text-gray-700 ol {
                  margin-bottom: 0.5rem !important;
                  padding-left: 1.5rem !important;
                }
                .text-gray-700 li {
                  margin-bottom: 0.25rem !important;
                }
              `}</style>
              
              <div className="flex items-center text-blue-600 text-sm font-medium pt-2">
                <span>Read more</span>
                <ChevronRight className="w-4 h-4 ml-1" />
            </div>
            </div>
          </div>
          </motion.div>

        {/* Section 3 - Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Today's Courses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Today's courses</h2>
            
            {/* Courses Completed */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {dashboardData.statistics.questions.seen || 0}
              </div>
              <div className="text-gray-600 text-sm mb-1">Courses completed</div>
              <div className="text-red-500 text-xs">▼ {Math.floor(Math.random() * 30 + 20)}% vs last week</div>
            </div>

            {/* Tests Completed */}
                <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {dashboardData.statistics.tests.finished || 0}
              </div>
              <div className="text-gray-600 text-sm mb-1">Number of tests</div>
              <div className="text-red-500 text-xs">▼ {Math.floor(Math.random() * 30 + 20)}% vs last week</div>
            </div>
          </motion.div>

          {/* Middle Column - Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance</h2>
            
            {/* Win Rate Gauge */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Success Rate</span>
                <span className="text-gray-900 font-bold">{dashboardData.statistics.questions.generalScore?.toFixed(0) || 37}%</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                  style={{ width: `${Math.min(dashboardData.statistics.questions.generalScore || 37, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Avg Score Gauge */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Avg. Score</span>
                <span className="text-gray-900 font-bold">{dashboardData.statistics.questions.generalScore?.toFixed(0) || 54}%</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                  style={{ width: `${Math.min(dashboardData.statistics.questions.generalScore || 54, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
          </div>

            {/* Avg. Study Time */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Avg. Study Time</span>
                <span className="text-gray-900 font-bold">13 min</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                  style={{ width: '65%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 min</span>
                <span>20 min</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h2>
            
            <NotificationsCarousel />
          </motion.div>
        </div>

        {/* Section 4 - Test and Exam This Week (3/4) & Leaderboard (1/4) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Test and Exam This Week - Takes 3/4 of the width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-3 bg-white rounded-2xl p-6 border border-blue-200 shadow-lg"
          >
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {(dashboardData.statistics.tests.seen || 0) + (dashboardData.statistics.exams.seen || 0)}
              </div>
              <div className="text-gray-600 text-sm mb-1">Test and exam this week</div>
              <div className="text-red-500 text-xs">▼ {Math.floor(Math.random() * 5 + 2)}% vs last week</div>
            </div>

            {/* Line Chart */}
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                {/* Y-axis grid lines */}
                {[0, 50, 100, 150].map((y, i) => (
                  <line
                    key={i}
                    x1="40"
                    y1={y + 10}
                    x2="380"
                    y2={y + 10}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
                {/* Study line (blue) */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  points="50,130 100,70 150,70 200,50 250,30 300,100 350,120"
                />
                {/* Exam line (yellow) */}
                <polyline
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="3"
                  points="50,100 100,80 150,60 200,70 250,80 300,60 350,50"
                />
                {/* Data points */}
                {[
                  { x: 50, y: 130 },
                  { x: 100, y: 70 },
                  { x: 150, y: 70 },
                  { x: 200, y: 50 },
                  { x: 250, y: 30 },
                  { x: 300, y: 100 },
                  { x: 350, y: 120 }
                ].map((point, i) => (
                  <circle key={i} cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
                ))}
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-12 right-8 flex justify-between text-xs text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* Legend */}
              <div className="absolute top-2 right-4 flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">Study</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-700">Exam</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard - Takes 1/4 of the width */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="lg:col-span-1 bg-white rounded-2xl p-6 border border-blue-200 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Leaderboard</h2>
            <div className="space-y-3">
              {[
                { name: 'Mary', score: 785 },
                { name: 'Rosie', score: 635 },
                { name: 'Bret', score: 604 },
                { name: 'Taylor', score: 506 },
                { name: 'Ralph', score: 471 },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between text-gray-900">
                  <span className="font-medium">{user.name}</span>
                  <span className="font-bold">{user.score} pts</span>
              </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Plane className="w-6 h-6 text-blue-600" />
            <span className="text-gray-900 font-bold text-lg">ATPS</span>
            <span className="text-gray-600 text-sm ml-2">Live Monitoring</span>
          </div>
          <div className="text-gray-900 font-medium text-lg">
            <LiveClock />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Live Clock Component
const LiveClock = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5" />
      <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  );
};

// Notifications Carousel Component
const NotificationsCarousel = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const notifications = [
    {
      type: 'success',
      icon: CheckCircle2,
      title: 'Test completed successfully',
      message: 'Air Law - You scored 85%',
      time: '2 hours ago',
      color: 'green'
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'New content available',
      message: 'New questions added to Mass & Balance',
      time: '5 hours ago',
      color: 'yellow'
    },
    {
      type: 'info',
      icon: Info,
      title: 'Study reminder',
      message: 'Complete 10 more questions to reach your daily goal',
      time: '1 day ago',
      color: 'blue'
    },
    {
      type: 'success',
      icon: CheckCircle2,
      title: 'Exam passed',
      message: 'Congratulations! You passed the Navigation exam',
      time: '3 days ago',
      color: 'green'
    }
  ];

  const currentNotification = notifications[currentIndex];
  const IconComponent = currentNotification.icon;

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
  }, [notifications.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + notifications.length) % notifications.length);
  };

  React.useEffect(() => {
    const interval = setInterval(goToNext, 5000); // Auto-rotate every 5 seconds
    return () => clearInterval(interval);
  }, [goToNext]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          iconText: 'text-green-600'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          iconText: 'text-yellow-600'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
          iconText: 'text-gray-600'
        };
    }
  };

  const colorClasses = getColorClasses(currentNotification.color);

  return (
    <div className="relative h-64">
      {/* Notification Card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`${colorClasses.bg} rounded-xl p-4 h-full border ${colorClasses.border}`}
      >
        <div className="flex items-start gap-3 h-full">
          <div className={`p-2 rounded-lg ${colorClasses.iconBg}`}>
            <IconComponent className={`w-5 h-5 ${colorClasses.iconText}`} />
          </div>
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {currentNotification.title}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                {currentNotification.message}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-auto">
              {currentNotification.time}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {notifications.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-2 transition-all shadow-sm"
      >
        <ChevronLeft className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-2 transition-all shadow-sm"
      >
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-8 w-64 bg-gray-200" />
      <Skeleton className="h-80 rounded-2xl bg-white" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-2xl bg-white" />
        <Skeleton className="h-64 rounded-2xl bg-white" />
        <Skeleton className="h-64 rounded-2xl bg-white" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Skeleton className="h-64 rounded-2xl bg-white lg:col-span-3" />
        <Skeleton className="h-64 rounded-2xl bg-white lg:col-span-1" />
      </div>
    </div>
  </div>
);

export default Dashboard;