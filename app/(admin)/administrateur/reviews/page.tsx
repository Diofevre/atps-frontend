'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { Search, AlertCircle, Star, RefreshCw, Filter, ChevronRight, ThumbsUp, Eye, EyeOff, Clock, Edit } from 'lucide-react';
import { COUNTRIES } from '@/lib/utils';
import QuestionsForm from '../questions/_components/form';

interface Question {
  id: number;
  question_text: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  countries: Record<string, Record<string, string[]>>;
  quality_score: string;
  question_images?: string[];
  explanation_images?: string[];
}

interface Review {
  id: number;
  user_id: string;
  question_id: number;
  country_seen: string;
  information: string;
  info_accuracy: number;
  seen: boolean;
  created_at: string;
  updated_at: string;
}

interface ReviewsState {
  reviews: Review[];
  filteredReviews: Review[];
  selectedCountry: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  selectedReview: Review | null;
  selectedQuestion: Question | null;
  isModalOpen: boolean;
  isLoadingQuestion: boolean;
  editingQuestionId: number | null;
}

function Reviews() {
  const [state, setState] = useState<ReviewsState>({
    reviews: [],
    filteredReviews: [],
    selectedCountry: 'All',
    searchQuery: '',
    isLoading: true,
    error: null,
    selectedReview: null,
    selectedQuestion: null,
    isModalOpen: false,
    isLoadingQuestion: false,
    editingQuestionId: null
  });

  const filterReviews = useCallback(() => {
    if (!state.reviews) return;
    
    let filtered = [...state.reviews];
    
    if (state.selectedCountry !== 'All') {
      filtered = filtered.filter(review => review.country_seen === state.selectedCountry);
    }
    
    if (state.searchQuery) {
      filtered = filtered.filter(review => 
        review.information.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        review.country_seen.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }
    
    setState(prev => ({ ...prev, filteredReviews: filtered }));
  }, [state.reviews, state.searchQuery, state.selectedCountry]);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [state.selectedCountry, state.searchQuery, state.reviews, filterReviews]);

  const fetchReviews = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setState(prev => ({
        ...prev,
        reviews: data,
        filteredReviews: data
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred while fetching reviews',
        reviews: [],
        filteredReviews: []
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleSeen = async (e: React.MouseEvent, reviewId: number, currentSeen: boolean) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}/seen`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seen: !currentSeen }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review seen status');
      }

      setState(prev => ({
        ...prev,
        reviews: prev.reviews.map(review =>
          review.id === reviewId ? { ...review, seen: !currentSeen } : review
        )
      }));
    } catch (error) {
      console.error('Error updating review seen status:', error);
    }
  };

  const handleViewQuestion = async (review: Review) => {
    setState(prev => ({
      ...prev,
      selectedReview: review,
      isLoadingQuestion: true,
      isModalOpen: true,
      editingQuestionId: review.question_id
    }));
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/${review.question_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch question details');
      }
      const data = await response.json();
      setState(prev => ({
        ...prev,
        selectedQuestion: data.question,
        isLoadingQuestion: false
      }));
    } catch (error) {
      console.error('Error fetching question details:', error);
      setState(prev => ({
        ...prev,
        selectedQuestion: null,
        isLoadingQuestion: false,
        error: 'Failed to fetch question details'
      }));
    }
  };

  const handleCloseModal = async () => {
    if (state.selectedReview && !state.selectedReview.seen) {
      await toggleSeen({ stopPropagation: () => {} } as React.MouseEvent, state.selectedReview.id, false);
    }
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      selectedReview: null,
      selectedQuestion: null,
      editingQuestionId: null
    }));
  };

  const handleModifyQuestion = async () => {
    await fetchReviews();
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

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 8) return 'text-green-600';
    if (accuracy >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (accuracy: number) => {
    const stars = [];
    const normalizedAccuracy = Math.round(accuracy / 2);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i < normalizedAccuracy ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 sm:truncate">Reviews Dashboard</h1>
                <div className="flex items-center mt-2">
                  <p className="text-sm text-gray-600">Question Reviews Management</p>
                  <span className="mx-2 text-gray-300">•</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{state.reviews.length} reviews</span>
                  </div>
                </div>
              </div>
              <button
                onClick={fetchReviews}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
                    value={state.searchQuery}
                    onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Filter by country:</span>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                <button
                  onClick={() => setState(prev => ({ ...prev, selectedCountry: 'All' }))}
                  className={`px-3 py-1.5 rounded-[20px] text-sm font-medium whitespace-nowrap transition-all ${
                    state.selectedCountry === 'All'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Countries
                </button>
                {COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => setState(prev => ({ ...prev, selectedCountry: country }))}
                    className={`px-3 py-1.5 rounded-[20px] text-sm font-medium whitespace-nowrap transition-all ${
                      state.selectedCountry === country
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {state.error && (
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-2 text-sm text-red-700">{state.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200">
            {state.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : (
              <>
                {state.filteredReviews.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {state.filteredReviews.map((review) => (
                      <li
                        key={review.id}
                        onClick={() => handleViewQuestion(review)}
                        className={`relative hover:bg-gray-50 transition-all group cursor-pointer ${
                          !review.seen ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="px-4 py-5 sm:px-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => toggleSeen(e, review.id, review.seen)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                                  !review.seen
                                    ? 'bg-blue-500 text-white hover:bg-blue-600 ring-4 ring-blue-100'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                                title={review.seen ? 'Mark as unread' : 'Mark as read'}
                              >
                                {review.seen ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {review.country_seen}
                                  </span>
                                  <span className="text-sm text-indigo-600 font-medium">
                                    Question ID: {review.question_id}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {getTimeAgo(review.created_at)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewQuestion(review);
                                }}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-900 line-clamp-2 pr-6 ml-[52px]">{review.information}</p>
                          <div className="mt-2 flex items-center justify-between ml-[52px]">
                            <span className="text-xs text-gray-500">
                              User: {review.user_id.slice(0, 8)}...
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${getAccuracyColor(review.info_accuracy)}`}>
                                {review.info_accuracy}/10
                              </span>
                              <div className="flex">
                                {renderStars(review.info_accuracy)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <Filter className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
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

      <QuestionsForm
        isOpen={state.isModalOpen}
        onClose={handleCloseModal}
        onModifyQuestion={handleModifyQuestion}
        editingQuestion={state.selectedQuestion}
        searchFiltersKeyword=""
        handleSearch={async () => {}}
        onAddQuestion={async () => {}}
      />
    </div>
  );
}

export default Reviews;