'use client'

import React, { useState, useEffect } from 'react';
import { Search, Book, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DictionaryEntry {
  id: number;
  word: string;
  definition: string;
}

const Dictionary = () => {
  const router = useRouter();
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10; // Number of entries per page (5 per column)

  useEffect(() => {
    fetchDictionary();
  }, []);

  const fetchDictionary = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dictionary`);
      const data = await response.json();
      // Sort entries alphabetically by word
      const sortedData = data.sort((a: DictionaryEntry, b: DictionaryEntry) => 
        a.word.localeCompare(b.word)
      );
      setEntries(sortedData);
      setCurrentPage(1); // Reset to first page when fetching new data
    } catch (error) {
      console.error('Error fetching dictionary:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchDictionary();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dictionary/search?word=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      // Sort search results alphabetically
      const sortedData = data.sort((a: DictionaryEntry, b: DictionaryEntry) => 
        a.word.localeCompare(b.word)
      );
      setEntries(sortedData);
      setCurrentPage(1); // Reset to first page when searching
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(entries.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = entries.slice(startIndex, endIndex);

  // Split current page entries into two columns
  const midPoint = Math.ceil(currentEntries.length / 2);
  const leftColumnEntries = currentEntries.slice(0, midPoint);
  const rightColumnEntries = currentEntries.slice(midPoint);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for navigation
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-main-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push(`/courses`)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Courses
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Technical Dictionary</h1>
                <p className="text-sm text-gray-600 mt-1">{entries.length} terms available</p>
              </div>
            </div>
            <div className="w-[140px]" /> {/* Spacer for centering */}
          </div>

          {/* Search Bar - Enhanced */}
          <div className="bg-white rounded-xl border border-blue-200 shadow-lg p-6">
            <div className="relative max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search for a term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 pl-12 pr-32 rounded-lg border border-blue-200 bg-blue-50/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
              />
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium shadow-sm"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Dictionary Entries */}
        {entries.length === 0 ? (
          <div className="bg-white rounded-xl border border-blue-200 shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No entries found</h3>
              <p className="text-gray-600">Try adjusting your search or browse all terms</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left Column */}
              <div className="space-y-4">
                {leftColumnEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          {entry.word?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {entry.word || '[No term]'}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                          {entry.definition}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {rightColumnEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          {entry.word?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {entry.word || '[No term]'}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                          {entry.definition}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination - Enhanced */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 hover:text-gray-900"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-blue-200 hover:bg-blue-50 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 hover:text-gray-900"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-600">
                  Page {currentPage} of {totalPages} ({entries.length} total entries)
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dictionary;