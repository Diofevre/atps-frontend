'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, User, ExternalLink, Film, Search, BookOpen, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/mock-clerk';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from './_components/HeaderVideo';
import BrowseTopicsModal from './_components/BrowseTopicsModal';
import Image from 'next/image';

interface Video {
  title: string;
  youtube_url: string;
  duration: string;
  description: string;
  thumbnail_url: string;
}

interface VideoResponse {
  topic: string;
  channel_name: string;
  channel_profile_image: string;
  genre: string;
  language: string;
  videos: Video[];
}

// Mock data for dashboard - to be replaced with real API calls later
const mockRecentVideos = [
  {
    id: 1,
    title: 'Introduction to Flight Navigation',
    topic: 'Navigation',
    duration: '15:30',
    progress: 65,
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
  },
  {
    id: 2,
    title: 'Aircraft Systems Overview',
    topic: 'Aircraft Systems',
    duration: '22:45',
    progress: 40,
    thumbnail: 'https://images.unsplash.com/photo-1517984786234-4af84cecca31?w=400',
  },
  {
    id: 3,
    title: 'Weather Patterns and Aviation',
    topic: 'Meteorology',
    duration: '18:20',
    progress: 80,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
];

const mockStats = {
  totalWatched: 24,
  completionRate: 68,
  hoursWatched: 12.5,
  inProgress: 8,
};

const VideoPage = () => {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoResponse | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!selectedTopicId) {
        setVideos(null);
        return;
      }
      
      setIsLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/videos/topic/${selectedTopicId}/search/${searchQuery || ''}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();

        console.log(data);

        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, [selectedTopicId, searchQuery, getToken]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    setEmbedError(false);
  };

  const handleIframeError = () => {
    setEmbedError(true);
  };

  const renderContent = () => {
    if (!selectedTopicId) {
      return (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg hover:border-blue-300 dark:hover:border-border-blue transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-text-secondary mb-1">Total Watched</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-foreground">{mockStats.totalWatched}</p>
                    <p className="text-xs text-gray-500 dark:text-text-secondary mt-1">videos</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Play className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg hover:border-blue-300 dark:hover:border-border-blue transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-text-secondary mb-1">Completion Rate</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-foreground">{mockStats.completionRate}%</p>
                    <p className="text-xs text-gray-500 dark:text-text-secondary mt-1">average</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg hover:border-blue-300 dark:hover:border-border-blue transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-text-secondary mb-1">Hours Watched</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-foreground">{mockStats.hoursWatched}</p>
                    <p className="text-xs text-gray-500 dark:text-text-secondary mt-1">total time</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg hover:border-blue-300 dark:hover:border-border-blue transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-text-secondary mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-foreground">{mockStats.inProgress}</p>
                    <p className="text-xs text-gray-500 dark:text-text-secondary mt-1">continue learning</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Continue Learning Section */}
          <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg hover:border-blue-300 dark:hover:border-border-blue transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">Continue Learning</h2>
                  <p className="text-sm text-gray-600 dark:text-text-secondary mt-1">Pick up where you left off</p>
                </div>
                <Button
                  variant="outline"
                  className="border-gray-200 dark:border-border hover:border-blue-300 dark:hover:border-border-blue hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                  onClick={() => setIsBrowseModalOpen(true)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse All Topics
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockRecentVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group cursor-pointer bg-gradient-to-br from-blue-50 to-white dark:from-slate-800/50 dark:to-card rounded-xl border border-gray-200 dark:border-border hover:border-blue-300 dark:hover:border-border-blue hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    onClick={() => setIsBrowseModalOpen(true)}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                          {video.topic}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-foreground mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-text-secondary">
                          <span>Progress</span>
                          <span>{video.progress}%</span>
                        </div>
                        <Progress value={video.progress} className="h-2" />
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
                    Explore our comprehensive video library covering all aspects of aviation and pilot training.
                  </p>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  onClick={() => setIsBrowseModalOpen(true)}
                >
                  Browse Topics
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
          <p className="mt-4 text-gray-600 dark:text-text-secondary font-medium">Loading videos...</p>
        </div>
      );
    }

    if (!videos?.videos?.length) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">No Videos Available</h2>
              <p className="text-gray-600 dark:text-text-secondary mb-6">Try selecting a different topic or adjusting your search</p>
              <Button
                variant="outline"
                className="border-gray-200 dark:border-border hover:border-blue-300 dark:hover:border-border-blue hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                onClick={() => setIsBrowseModalOpen(true)}
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Other Topics
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto">
        {/* Topic Header */}
        <div className="mb-6">
          <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border shadow-lg p-6 hover:border-blue-300 dark:hover:border-border-blue transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">{videos.topic}</h2>
                <p className="text-sm text-gray-600 dark:text-text-secondary mt-1">
                  {videos.videos.length} {videos.videos.length === 1 ? 'video' : 'videos'} available
                </p>
              </div>
              {videos.channel_profile_image && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-border">
                    <Image
                      src={videos.channel_profile_image}
                      alt={videos.channel_name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-text-secondary">{videos.channel_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {videos.videos.map((video, index) => (
            <Card 
              key={index} 
              className="group bg-white dark:bg-card border border-gray-200 dark:border-border hover:border-blue-300 dark:hover:border-border-blue shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-3 text-gray-900 dark:text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-text-secondary mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{video.duration}</span>
                    </div>
                    {videos.channel_name && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[100px]">{videos.channel_name}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <Progress 
                    value={30} 
                    className="h-1.5 bg-blue-100"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTopicChange={setSelectedTopicId}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          
          {embedError ? (
            <div className="p-6">
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  This video cannot be embedded. You can watch it directly on YouTube.
                </AlertDescription>
              </Alert>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open(selectedVideo?.youtube_url, '_blank')}
              >
                Watch on YouTube
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={selectedVideo?.youtube_url.replace('watch?v=', 'embed/')}
                title={selectedVideo?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                onError={handleIframeError}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BrowseTopicsModal
        isOpen={isBrowseModalOpen}
        onClose={() => setIsBrowseModalOpen(false)}
        onTopicSelect={setSelectedTopicId}
      />
    </div>
  );
};

export default VideoPage;