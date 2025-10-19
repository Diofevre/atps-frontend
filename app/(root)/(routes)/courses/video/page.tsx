'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, User, ExternalLink, Film, Search } from 'lucide-react';
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/topic/${selectedTopicId}/search/${searchQuery || ''}`,
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
        <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto px-4">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
            <div className="relative flex items-center justify-center w-full h-full bg-primary/5 rounded-full">
              <Film className="w-12 h-12 text-primary" />
            </div>
          </div>
      
          <h2 className="text-5xl font-bold mb-6 text-center">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Welcome to Your Learning Journey
            </span>
          </h2>
      
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl">
            Discover a world of knowledge through our curated video collection. Select a topic to begin your learning adventure.
          </p>
      
          {/* Centrage horizontal et vertical */}
          <div className="flex items-center justify-center w-full">
            <Button
              variant="outline"
              className="flex flex-col items-center p-6 h-auto gap-4 hover:border-primary/50 transition-colors group overflow-hidden text-center"
              onClick={() => setIsBrowseModalOpen(true)}
            >
              <Search className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Browse Topics</h3>
                <p className="text-sm text-muted-foreground">
                  Explore our diverse range of educational content
                </p>
              </div>
            </Button>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading videos...</p>
        </div>
      );
    }

    if (!videos?.videos?.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-3xl font-bold mb-4">No Videos Available</h2>
          <p className="text-muted-foreground text-lg">Try selecting a different topic or adjusting your search</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {videos.videos.map((video, index) => (
          <Card 
            key={index} 
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <CardContent className="p-0">
              <div 
                className="relative aspect-video cursor-pointer overflow-hidden"
                onClick={() => handleVideoClick(video)}
              >
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 hover:scale-110 transition-transform duration-300"
                  >
                    <Play className="h-6 w-6 text-white" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
                  {video.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{video.duration}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">{videos.channel_name}</span>
                    </div>
                  </div>
                  <Progress 
                    value={30} 
                    className="h-0.5 bg-secondary group-hover:bg-secondary/80 transition-colors duration-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTopicChange={setSelectedTopicId}
      />

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          
          {embedError ? (
            <div className="p-6">
              <Alert className="mb-4">
                <AlertDescription>
                  This video cannot be embedded. You can watch it directly on YouTube.
                </AlertDescription>
              </Alert>
              <Button
                className="w-full"
                onClick={() => window.open(selectedVideo?.youtube_url, '_blank')}
              >
                Watch on YouTube
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="aspect-video">
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