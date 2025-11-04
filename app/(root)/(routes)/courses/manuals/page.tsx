'use client';

import { useState, useEffect } from 'react';
import { Book, ChevronRight, FileText, TrendingUp, Clock, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import HeaderManual from './_components/HeaderManual';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Lesson {
  lesson_id: number;
  debut_page: number;
  page_id: number;
}

interface TopicLessons {
  topic_lesson_id: number;
  Lesson: Lesson[];
}

// Mock data for dashboard - to be replaced with real API calls later
const mockRecentManuals = [
  {
    id: 1,
    title: 'Aircraft Performance Manual',
    topic: 'Performance',
    page: 45,
    totalPages: 120,
    progress: 38,
    lastOpened: '2 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1517984786234-4af84cecca31?w=400',
  },
  {
    id: 2,
    title: 'Navigation Systems Guide',
    topic: 'Navigation',
    page: 89,
    totalPages: 150,
    progress: 59,
    lastOpened: '5 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
  },
  {
    id: 3,
    title: 'Meteorology Basics',
    topic: 'Meteorology',
    page: 23,
    totalPages: 80,
    progress: 29,
    lastOpened: '1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
];

const mockStats = {
  totalRead: 18,
  completionRate: 52,
  pagesRead: 1240,
  inProgress: 6,
  completed: 12,
};

const ManualPage = () => {
  const router = useRouter();
  const [topicLessons, setTopicLessons] = useState<TopicLessons | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedTopicId) {
        setTopicLessons(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lessons/${selectedTopicId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || `Failed to fetch lessons. Status: ${response.status}`);
        }

        const data = await response.json();
        setTopicLessons(data);
      } catch (err: unknown) {
        console.error('Error fetching lessons:', err);
          let message = "An unknown error occurred"

          if (err instanceof Error){
              message = err.message
          }
        setError(message);
        setTopicLessons(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [selectedTopicId]);

  const handleLessonClick = (lessonId: number, topicLessonId: number, pageId: number, debutPage: number) => {
    if (topicLessonId) {
        router.push(`/courses/manuals/${topicLessonId}/${lessonId}/${pageId}?debutPage=${debutPage}`);
    }
  };

  const renderContent = () => {
      if (!selectedTopicId) {
      return (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Read</p>
                      <p className="text-3xl font-bold text-gray-900">{mockStats.totalRead}</p>
                      <p className="text-xs text-gray-500 mt-1">manuals</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Book className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                      <p className="text-3xl font-bold text-gray-900">{mockStats.completionRate}%</p>
                      <p className="text-xs text-gray-500 mt-1">average</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pages Read</p>
                      <p className="text-3xl font-bold text-gray-900">{mockStats.pagesRead.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">total pages</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <FileText className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">In Progress</p>
                      <p className="text-3xl font-bold text-gray-900">{mockStats.inProgress}</p>
                      <p className="text-xs text-gray-500 mt-1">continue reading</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Continue Reading Section */}
            <Card className="bg-white border border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Continue Reading</h2>
                    <p className="text-sm text-gray-600 mt-1">Pick up where you left off</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {mockStats.completed} completed
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockRecentManuals.map((manual) => (
                    <div
                      key={manual.id}
                      className="group cursor-pointer bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                        <Image
                          src={manual.thumbnail}
                          alt={manual.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                          Page {manual.page}/{manual.totalPages}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                            {manual.topic}
                  </span>
                          <span className="text-xs text-gray-500">{manual.lastOpened}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {manual.title}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Progress</span>
                            <span>{manual.progress}%</span>
                          </div>
                          <Progress value={manual.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-xl">
              <CardContent className="p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">Ready to Start Learning?</h2>
                    <p className="text-blue-100">
                      Explore our comprehensive manual library covering all aspects of aviation and pilot training.
                    </p>
                  </div>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  >
                    Browse Manuals
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
      );
  }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading lessons...</p>
        </div>
      );
    }

      if (error) {
          return (
              <div className="max-w-4xl mx-auto">
                <Card className="bg-white border border-red-200 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Lessons</h2>
                    <p className="text-gray-600">{error}</p>
                  </CardContent>
                </Card>
              </div>
          );
      }


    if (!topicLessons?.Lesson || topicLessons.Lesson.length === 0) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-blue-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Lessons Available</h2>
              <p className="text-gray-600 mb-6">Try selecting a different topic</p>
            </CardContent>
          </Card>
        </div>
      );
    }


    return (
      <div className="max-w-7xl mx-auto">
        {/* Topic Header */}
        <div className="mb-6">
          <Card className="bg-white border border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Lessons Overview</h2>
                  <p className="text-sm text-gray-600 mt-1">
            {topicLessons.Lesson.length} {topicLessons.Lesson.length === 1 ? 'lesson' : 'lessons'} available
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topicLessons.Lesson.map((lesson) => (
            <Card
              key={lesson.lesson_id}
              className="group bg-white border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleLessonClick(lesson.lesson_id, topicLessons.topic_lesson_id, lesson.page_id, lesson.debut_page)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
                    <div className="relative w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Lesson {lesson.lesson_id}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                    <Book className="w-4 h-4" />
                    <span>Page {lesson.debut_page}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-blue-200 w-full flex items-center justify-center gap-2 text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <HeaderManual
        onTopicChange={setSelectedTopicId}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default ManualPage;