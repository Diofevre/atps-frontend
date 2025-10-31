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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push(`/courses`)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Terms
          </button>
          <div className="flex items-center">
            <Book className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Technical Dictionary</h1>
          </div>
          <div className="w-[120px]" /> {/* Spacer for centering */}
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for a term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-sm"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No entries found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left Column */}
              <div className="space-y-4">
                {leftColumnEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {entry.word || '[No term]'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {entry.definition}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {rightColumnEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {entry.word || '[No term]'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {entry.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mt-4 text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, entries.length)} of {entries.length} entries
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dictionary;