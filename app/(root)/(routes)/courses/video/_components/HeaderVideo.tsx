'use client';

import { ChevronLeft, Search, Bookmark, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Topics from '../../../questions-bank/_components/Topics';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onTopicChange: (topicId: string) => void;
}

const Header = ({ searchQuery, onSearchChange, onTopicChange }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-10">
      <div className="backdrop-blur-lg">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="h-16 flex items-center justify-between gap-4">
            <Link 
              href="/courses" 
              className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium mb-0.5 uppercase">Back to Courses</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                <Bookmark className="h-4 w-4" />
                <span>Saved</span>
              </Button>
            </div>
          </div>

          {/* Main Header Content */}
          <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Video Library</h1>
                <p className="text-sm text-muted-foreground">Explore educational content</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row items-stretch gap-4 w-full sm:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-4 -translate-y-1/5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search videos..."
                  className="w-full pl-10 border-primary/20 rounded-full h-12 focus:ring-2 focus:ring-primary/20 focus:border-transparent bg-background"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              <Topics onSelectionChange={onTopicChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;