'use client';

import { useState, useEffect } from 'react';
import { Book, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import HeaderManual from './_components/HeaderManual';
import { useRouter } from 'next/navigation';

interface Lesson {
  lesson_id: number;
  debut_page: number;
  page_id: number;
}

interface TopicLessons {
  topic_lesson_id: number;
  Lesson: Lesson[];
}

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
          <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto px-4">
              <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                  <div className="relative flex items-center justify-center w-full h-full bg-primary/5 rounded-full">
                      <Book className="w-12 h-12 text-primary" />
                  </div>
              </div>

              <h2 className="text-5xl font-bold mb-6 text-center">
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      Course Manual
                  </span>
              </h2>

              <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl">
                  Select a topic to view available lessons and their corresponding page numbers.
              </p>
          </div>
      );
  }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading lessons...</p>
        </div>
      );
    }

      if (error) {
          return (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-3xl font-bold mb-4">Error</h2>
                  <p className="text-muted-foreground text-lg">{error}</p>
              </div>
          );
      }


    if (!topicLessons?.Lesson || topicLessons.Lesson.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-3xl font-bold mb-4">No Lessons Available</h2>
          <p className="text-muted-foreground text-lg">Try selecting a different topic</p>
        </div>
      );
    }


    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Lessons Overview</h2>
          <span className="text-sm text-muted-foreground">
            {topicLessons.Lesson.length} {topicLessons.Lesson.length === 1 ? 'lesson' : 'lessons'} available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topicLessons.Lesson.map((lesson) => (
            <Card
              key={lesson.lesson_id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleLessonClick(lesson.lesson_id, topicLessons.topic_lesson_id, lesson.page_id, lesson.debut_page)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 relative">
                    <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse group-hover:bg-primary/10 transition-colors" />
                    <div className="relative w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    Lesson {lesson.lesson_id}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Book className="w-4 h-4" />
                    <span>Page {lesson.debut_page}</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border w-full flex items-center justify-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
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
    <div className="min-h-screen">
      <HeaderManual
        onTopicChange={setSelectedTopicId}
      />

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default ManualPage;