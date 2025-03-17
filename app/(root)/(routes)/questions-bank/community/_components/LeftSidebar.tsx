import React, { useState } from 'react';
import { Search, PlusCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface LeftSidebarProps {
  onCreatePost: () => void;
  onSearch: (query: string) => void;
}

export function LeftSidebar({ onCreatePost, onSearch }: LeftSidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 h-screen sticky top-0">
      <div className="p-6">
        {/* Back */}
        <div className='mb-3'>
          <button
            onClick={() => router.push('/questions-bank')}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors text-sm border border-gray-700 py-2 px-4 rounded-[12px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Input */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearch}
            className={cn(
              "w-full pl-11 pr-4 py-3",
              "bg-gray-800 border border-gray-700 rounded-xl",
              "text-gray-100 placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "transition-all duration-200",
              "hover:bg-gray-800/80"
            )}
          />
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-500 group-hover:text-gray-400 transition-colors duration-200" />
        </div>
        
        <button
          onClick={onCreatePost}
          className={cn(
            "w-full mt-4 flex items-center justify-center gap-2",
            "bg-[#EECE84] hover:bg-[#f4d898] active:bg-[#d4b670]",
            "px-4 py-3 rounded-xl",
            "transition-all duration-200",
            "font-medium text-sm text-gray-900",
            "shadow-sm hover:shadow-md",
            "transform hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          <PlusCircle className="h-4 w-4" />
          Create New Post
        </button>
      </div>
    </aside>
  );
}

export default LeftSidebar;