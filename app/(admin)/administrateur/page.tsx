'use client'

import React from 'react';
import { 
  Users, 
  GraduationCap, 
  ClipboardList, 
  Trophy,
  Clock,
  BookOpen,
  Timer,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  username: string;
}

interface TopUser {
  user_id: string;
  average_score: string | null;
  user: User;
}

interface Topic {
  topic_id: number;
  topic_name: string;
  total_tests: number;
  total_exams: number;
}

interface Test {
  id: number;
  user_id: string;
  is_finished: boolean;
  timespent: string | null;
  score: number;
  total_question: number;
  finished_question: number;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface Exam {
  id: number;
  topic_id: number;
  user_id: string;
  number_of_questions: number;
  exam_duration: string;
  is_finished: boolean;
  timespent: string;
  score: number;
  finished_question: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  topic: {
    id: number;
    topic_name: string;
  };
}

interface Statistics {
  totalTests: number;
  totalExams: number;
  totalUsers: number;
  usersWithTests: number;
  usersWithExams: number;
}

interface DashboardData {
  statistics: Statistics;
  topics: Topic[];
  topUsers: TopUser[];
  recentActivity: {
    tests: Test[];
    exams: Exam[];
  };
}

function App() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/admin`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: string | null) => {
    if (!duration) return '-';
    return duration;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Total Users</p>
                <p className="text-3xl font-bold">{data.statistics.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Total Exams</p>
                <p className="text-3xl font-bold">{data.statistics.totalExams}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Total Tests</p>
                <p className="text-3xl font-bold">{data.statistics.totalTests}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/80">Active Topics</p>
                <p className="text-3xl font-bold">{data.topics.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Users */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                Top Performing Users
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {data.topUsers.map((user, index) => (
                <div key={user.user_id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg ${
                          index === 0 ? 'bg-amber-100 text-amber-600' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        } flex items-center justify-center font-bold`}>
                          #{index + 1}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-gray-900">{user.user.username}</p>
                        <p className="text-sm text-gray-500">{user.user.name || 'No name'}</p>
                      </div>
                    </div>
                    {user.average_score && (
                      <div className="text-sm font-bold text-gray-900">
                        {(parseFloat(user.average_score) * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {[...data.recentActivity.tests, ...data.recentActivity.exams]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((activity) => {
                  const isExam = 'topic' in activity;
                  return (
                    <div key={`${isExam ? 'exam' : 'test'}-${activity.id}`} 
                         className="p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            isExam ? 'bg-violet-100 text-violet-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {isExam ? <GraduationCap className="h-5 w-5" /> : <ClipboardList className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {activity.user.username} - {isExam ? 'Exam' : 'Test'} #{activity.id}
                            </p>
                            <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                              <Timer className="h-4 w-4" />
                              <span>{formatDuration(activity.timespent)}</span>
                              <span>•</span>
                              <span className={`font-medium ${
                                activity.score >= 70 ? 'text-emerald-600' :
                                activity.score >= 50 ? 'text-amber-600' :
                                'text-red-600'
                              }`}>
                                {activity.score.toFixed(1)}%
                              </span>
                              {activity.is_finished ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(activity.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 text-emerald-500 mr-2" />
              Topics Overview
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Topic Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Exams
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Activity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.topics.map((topic) => (
                  <tr key={topic.topic_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{topic.topic_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-blue-600">{topic.total_tests}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-violet-600">{topic.total_exams}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-emerald-600">
                        {topic.total_tests + topic.total_exams}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;