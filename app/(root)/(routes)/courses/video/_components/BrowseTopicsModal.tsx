'use client';

import { useState } from 'react';
import { Search, Loader2, Clock, User, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/mock-clerk';
import Image from 'next/image';

interface Video {
  title: string;
  youtube_url: string;
  duration: string;
  thumbnail_url: string;
}

interface VideoResponse {
  topic: string;
  channel_name: string;
  videos: Video[];
}

interface BrowseTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopicSelect: (topicId: string) => void;
}

const BrowseTopicsModal = ({ isOpen, onClose }: BrowseTopicsModalProps) => {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setVideos(null);
      return;
    }
    
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos/search/${query}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">Search Videos</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for videos..."
              className="w-full pl-10 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !searchQuery ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Search className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Enter a search term to find videos</p>
            </div>
          ) : videos?.videos?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
              {videos.videos.map((video, index) => (
                <div
                  key={index}
                  className="group cursor-pointer rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 hover:scale-110 transition-all"
                      >
                        <Play className="h-6 w-6 text-white" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{videos.channel_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-muted-foreground">No videos found for `{searchQuery}`</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BrowseTopicsModal;