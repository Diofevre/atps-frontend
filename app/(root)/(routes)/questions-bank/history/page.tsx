'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useUser } from '@clerk/nextjs';
import { Loader } from '@/components/ui/loader';
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ActionDropdown from '../_components/SelectHistory';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

interface RawTest {
  topic: string;
  created_at: string;
  timespent: string;
  total_question: number;
  score: number;
  test_id: number;
  is_finished: boolean;
}

interface TestHistory {
  topic: string;
  date: string;
  timeSpent: string;
  totalQuestions: number;
  score: number;
  testId: number;
  isFinished: boolean;
}

type FilterType = 'all' | 'saved' | 'validated';

const History = () => {
  const { user } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyData, setHistoryData] = useState<TestHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const rowsPerPage = 20;

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    const fetchHistory = async () => {
      const token = await getToken();
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests/list/${userId}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch history data.');
        }
        const data: { unfinishedTests: RawTest[] } = await response.json();
        const transformedData: TestHistory[] = data.unfinishedTests.map((test) => ({
          topic: test.topic || 'Unknown Topic',
          date: new Date(test.created_at).toLocaleDateString('fr-FR'),
          timeSpent: test.timespent || 'N/A',
          totalQuestions: test.total_question,
          score: test.score,
          testId: test.test_id,
          isFinished: test.is_finished,
        }));

        setHistoryData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getToken, user]);

  const handleSelectTest = (testId: number, event: React.MouseEvent | boolean) => {
    if (typeof event === 'boolean') {
      setSelectedTests(prev => 
        prev.includes(testId) 
          ? prev.filter(id => id !== testId)
          : [...prev, testId]
      );
      return;
    }

    if ((event.target as HTMLElement).closest('button') || 
        (event.target as HTMLElement).closest('[role="menuitem"]')) {
      return;
    }

    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSelectAll = (tests: TestHistory[]) => {
    const testIds = tests.map(test => test.testId);
    if (selectedTests.length === testIds.length) {
      setSelectedTests([]);
    } else {
      setSelectedTests(testIds);
    }
  };

  const handleDeleteTests = async () => {
    if (selectedTests.length === 0) return;
    
    setIsDeleting(true);
    const token = await getToken();
    
    try {  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests/supprimeTest`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ testIds: selectedTests }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete tests');
      }

      setHistoryData(prev => prev.filter(test => !selectedTests.includes(test.testId)));
      setSelectedTests([]);
      toast.success('Tests deleted successfully');
    } catch (error) {
      console.error('Error deleting tests:', error);
      toast.error('Failed to delete tests');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleTestDelete = (deletedTestId: number) => {
    setHistoryData(prev => prev.filter(test => test.testId !== deletedTestId));
    setSelectedTests(prev => prev.filter(id => id !== deletedTestId));
  };

  const handleResumeTest = (testId: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeSpents', '0');
    }
  
    if (!testId) {
      console.error('testId is missing. Cannot resume the quiz.');
      return;
    }
  
    router.push(`/questions-bank/study/quizz?testId=${testId}&fromHistory=true`);
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (score >= 60) return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (score >= 40) return 'bg-amber-100 text-amber-700 border border-amber-200';
    return 'bg-red-100 text-red-700 border border-red-200';
  };

  const sortedFilteredData = React.useMemo(() => {
    // First, separate the data into saved and validated tests
    const savedTests = historyData.filter(test => !test.isFinished);
    const validatedTests = historyData.filter(test => test.isFinished);

    // If we're filtering, return only the filtered data
    if (activeFilter === 'saved') return savedTests;
    if (activeFilter === 'validated') return validatedTests;

    // For 'all' filter, combine saved tests first, then validated
    return [...savedTests, ...validatedTests];
  }, [historyData, activeFilter]);

  const totalPages = Math.ceil(sortedFilteredData.length / rowsPerPage);
  const paginatedData = sortedFilteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-screen text-red-500">
        <p>An error occurred:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Header */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <Link href="/questions-bank" className="flex items-center gap-0.5 text-foreground hover:text-muted-foreground transition-colors">
              <ChevronLeft className="w-5 h-5 mt-0.5" />
              <span className="text-xl">History</span>
            </Link>
            {selectedTests.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center gap-2 rounded-[12px]"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedTests.length})
              </Button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="p-1.5">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveFilter('all');
                  setCurrentPage(1);
                }}
                className={`${activeFilter === 'all' ? 'bg-[#EECE84] hover:bg-[#EECE84]' : 'hover:bg-[#EECE84]/80'} rounded-[12px] text-black`}
              >
                All ({historyData.length})
              </Button>
              <Button
                variant={activeFilter === 'saved' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveFilter('saved');
                  setCurrentPage(1);
                }}
                className={`${activeFilter === 'saved' ? 'bg-[#EECE84] hover:bg-[#EECE84]' : 'hover:bg-[#EECE84]/80'} rounded-[12px] text-black`}
              >
                Saved ({historyData.filter(test => !test.isFinished).length})
              </Button>
              <Button
                variant={activeFilter === 'validated' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveFilter('validated');
                  setCurrentPage(1);
                }}
                className={`${activeFilter === 'validated' ? 'bg-[#EECE84] hover:bg-[#EECE84]' : 'hover:bg-[#EECE84]/80'} rounded-[12px] text-black`}
              >
                Validated ({historyData.filter(test => test.isFinished).length})
              </Button>
            </div>
            {paginatedData.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={paginatedData.length > 0 && paginatedData.every(test => selectedTests.includes(test.testId))}
                  onCheckedChange={() => handleSelectAll(paginatedData)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            )}
          </div>
        </div>

        {/* Tests Grid */}
        {paginatedData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-1.5">
            {paginatedData.map((item, index) => (
              <Card 
                key={index} 
                onClick={(e) => handleSelectTest(item.testId, e)}
                className={`group relative bg-white overflow-hidden transition-all duration-200 cursor-pointer
                  ${selectedTests.includes(item.testId)
                    ? 'ring-2 ring-red-500 bg-red-50'
                    : 'hover:shadow-md border border-gray-200'
                  }`}
              >
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedTests.includes(item.testId)}
                    className="h-4 w-4"
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={() => handleSelectTest(item.testId, true)}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-end mb-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(item.score)}`}>
                      {item.score}%
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-1">
                    {item.topic}
                  </h3>

                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <div>
                      <dt className="text-gray-500">Date</dt>
                      <dd className="font-medium text-gray-900">{item.date}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Time</dt>
                      <dd className="font-medium text-gray-900">{item.timeSpent}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Questions</dt>
                      <dd className="font-medium text-gray-900">{item.totalQuestions}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Score</dt>
                      <dd className="font-medium text-gray-900">{item.score}%</dd>
                    </div>
                  </dl>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    {!item.isFinished && (
                      <Button 
                        onClick={() => handleResumeTest(item.testId)}
                        variant="secondary"
                        size="sm"
                        className="flex-1 mr-2 bg-[#EECE84]/30 hover:bg-[#EECE84]/50 text-gray-700 text-xs"
                      >
                        Continue Test
                      </Button>
                    )}
                    <ActionDropdown
                      testId={item.testId}
                      topic={item.topic}
                      totalQuestions={item.totalQuestions}
                      onDelete={handleTestDelete}
                      isFinished={item.isFinished}
                      isValidation={true}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No tests found for the selected filter.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                size="sm"
                className="h-8 px-3 hover:bg-[#EECE84]"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {generatePaginationNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-2 text-gray-400 text-sm">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "ghost"}
                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        size="sm"
                        className={`h-8 w-8 p-0 text-sm ${
                          currentPage === page 
                            ? 'bg-[#EECE84] hover:bg-[#EECE84]/80 text-black'
                            : 'text-black hover:bg-[#EECE84]/50'
                        }`}
                      >
                        {page}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                size="sm"
                className="h-8 px-3 hover:bg-[#EECE84]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected tests?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedTests.length} selected {selectedTests.length === 1 ? 'test' : 'tests'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className='border-none hover:bg-transparent shadow-none hover:text-black/50'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTests}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 rounded-[12px]"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default History;