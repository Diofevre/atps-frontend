'use client';

import { ChevronLeft, Bookmark, Book } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Topics from '../../../questions-bank/_components/Topics';

interface HeaderProps {
  onTopicChange: (topicId: string) => void;
}

const HeaderManual = ({ onTopicChange }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-10">
      <div className="backdrop-blur-lg border-b">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="h-16 flex items-center justify-between gap-4 border-b border-border/40">
            <Link 
              href="/courses" 
              className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors group"
            >
              <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium mb-0.5 uppercase text-sm tracking-wide">Back to Courses</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex gap-2 hover:bg-primary/5"
              >
                <Bookmark className="h-4 w-4" />
                <span className="font-medium">Saved</span>
              </Button>
            </div>
          </div>

          {/* Main Header Content */}
          <div className="py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3.5 rounded-full ring-1 ring-primary/20">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight mb-1">Chapter Library</h1>
                <p className="text-sm text-muted-foreground">Explore educational content</p>
              </div>
            </div>

            <Topics onSelectionChange={onTopicChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderManual;