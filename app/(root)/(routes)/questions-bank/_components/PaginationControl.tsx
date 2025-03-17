'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (direction: 'prev' | 'next') => void;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      <Button
        size="icon"
        onClick={() => onPageChange('prev')}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-[12px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 shadow-sm transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </Button>
      <span className="font-medium text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-[12px] border border-gray-200 dark:border-gray-700">
        {currentPage} / {totalPages}
      </span>
      <Button
        size="icon"
        onClick={() => onPageChange('next')}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-[12px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 shadow-sm transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </Button>
    </div>
  );
};

export default PaginationControl;