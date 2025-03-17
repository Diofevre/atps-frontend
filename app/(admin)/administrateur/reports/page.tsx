'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Search, AlertCircle, FileText, RefreshCw, Filter, ChevronRight, Eye, EyeOff, X, Clock } from 'lucide-react';

interface Report {
  id: number;
  user_id: string;
  categorie: string;
  contenu: string;
  seen: boolean;
  created_at: string;
  updated_at: string;
}

const categories = [
  'All',
  'Inaccurate',
  'Outdated',
  'Incomplete',
  'Display',
  'Other Issue'
];

function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterReports = useCallback(() => {
    if (!reports) return;
    
    let filtered = [...reports];
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(report => report.categorie === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(report => 
        report.contenu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.categorie.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredReports(filtered);
  }, [reports, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [selectedCategory, searchQuery, reports, filterReports]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      setReports(data);
      setFilteredReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching reports');
      setReports([]);
      setFilteredReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSeen = async (e: React.MouseEvent, reportId: number, currentSeen: boolean) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}/seen`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seen: !currentSeen }),
      });

      if (!response.ok) {
        throw new Error('Failed to update report seen status');
      }

      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? { ...report, seen: !currentSeen } : report
        )
      );
    } catch (error) {
      console.error('Error updating report seen status:', error);
    }
  };

  const openReportDetails = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    if (selectedReport && !selectedReport.seen) {
      await toggleSeen({ stopPropagation: () => {} } as React.MouseEvent, selectedReport.id, false);
    }
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error(error);
      return 'Invalid date';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

  const getCategoryBadgeClass = (category: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md';
    const variants = {
      'Incomplete': 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
      'Inaccurate': 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
      'Outdated': 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20',
      'Display': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
      'Other Issue': 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20'
    };
    return `${baseClasses} ${variants[category as keyof typeof variants] || 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold text-gray-900 truncate">Reports Dashboard</h1>
                <div className="flex items-center mt-1">
                  <p className="text-sm text-gray-500">System Reports Management</p>
                  <span className="mx-2 text-gray-300">•</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{reports.length} reports</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchReports}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-2 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports List */}
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : (
              <>
                {filteredReports.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <li
                        key={report.id}
                        onClick={() => openReportDetails(report)}
                        className={`relative hover:bg-gray-50 transition-all group cursor-pointer ${
                          !report.seen ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="px-4 py-5 sm:px-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => toggleSeen(e, report.id, report.seen)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                                  !report.seen
                                    ? 'bg-blue-500 text-white hover:bg-blue-600 ring-4 ring-blue-100'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                                title={report.seen ? 'Mark as unread' : 'Mark as read'}
                              >
                                {report.seen ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={getCategoryBadgeClass(report.categorie)}>
                                    {report.categorie}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ID: {report.id}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {getTimeAgo(report.created_at)}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-sm text-gray-900 line-clamp-2 pr-6 ml-[52px]">{report.contenu}</p>
                          <div className="mt-2 ml-[52px]">
                            <span className="text-xs text-gray-500">
                              User: {report.user_id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <Filter className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Report Details Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Report Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={getCategoryBadgeClass(selectedReport.categorie)}>
                          {selectedReport.categorie}
                        </span>
                        <span className="text-sm text-gray-500">
                          {getTimeAgo(selectedReport.created_at)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleSeen(e, selectedReport.id, selectedReport.seen)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                          !selectedReport.seen
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {selectedReport.seen ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Report Content</h4>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedReport.contenu}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">User ID</h4>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{selectedReport.user_id}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(selectedReport.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;