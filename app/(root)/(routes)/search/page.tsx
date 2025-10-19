/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react';
import { Calendar, MapPin, School, AlertCircle, BookOpen, Search } from 'lucide-react';
import { ExaminingAuthorityCard } from '../questions-bank/_components/ExaminingAuthorityCard';
import Topics from '../questions-bank/_components/Topics';
import QuestionSearchDialog from './_components/details-search-modal';
import { highlightSearchTerms } from '@/lib/search-highlight';

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

interface SearchResponse {
  total_question: number;
  questions: Question[];
}

interface SearchFilters {
  keyword: string;
  country: string | null;
  topicId: string | null;
  lastExam: boolean | null;
}

const SearchPage = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keyword: '',
    country: null,
    topicId: null,
    lastExam: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopicName, setSelectedTopicName] = useState<string>('');

  const isSearchButtonDisabled = !searchFilters.keyword.trim();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSearchButtonDisabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // Validation supplémentaire pour éviter les URLs malformées
      const keyword = searchFilters.keyword.trim();
      if (!keyword) {
        setError('Please enter a search keyword');
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/tests/search/${encodeURIComponent(keyword)}`;
      url += `/${searchFilters.country === null ? 'null' : encodeURIComponent(searchFilters.country)}`;
      url += `/${searchFilters.topicId === null ? 'null' : encodeURIComponent(searchFilters.topicId)}`;
      url += `/${searchFilters.lastExam === null ? 'null' : searchFilters.lastExam}`; //handle the null to null string

      console.log('🔍 Search URL:', url); // Debug log
      const response = await fetch(url);
      if (!response.ok) throw new Error('Search failed');

      const data: SearchResponse = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch results. Please try again.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (value: string | null) => {
    setSearchFilters(prev => ({ ...prev, country: value }));
  };

  const handleTopicChange = (value: string, label: string) => {
    setSearchFilters(prev => ({ ...prev, topicId: value === 'all' ? null : value }));
    setSelectedTopicName(label);
  };

  const handleLastExamChange = (value: boolean | null) => {
    setSearchFilters(prev => ({...prev, lastExam: value}))
  }


  const renderQuestionCard = (question: Question) => {
    const countryEntries = Object.entries(question.countries);
    const totalExams = countryEntries.reduce((acc, [, years]) => {
      return acc + Object.values(years).flat().length;
    }, 0);

    return (
      <QuestionSearchDialog key={question.id} questionId={question.id} searchTerm={searchFilters.keyword}>
        <div className="group relative hover:cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#EECE84]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EECE84]/10">
                    <School className="w-4 h-4 text-[#EECE84]" />
                  </div>
                  Question {question.id}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-[#EECE84]" />
                    {totalExams} exams
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm bg-green-50 text-green-700">
                    <BookOpen className="w-3.5 h-3.5" />
                    {question.quality_score}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div
                dangerouslySetInnerHTML={{ __html: highlightSearchTerms(question.question_text, searchFilters.keyword) }}
                className="prose prose-sm max-w-none text-gray-700"
              />

              {question.question_images && question.question_images.length > 0 && (
                <div className="relative h-56 rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={question.question_images[0]}
                    alt="Question illustration"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {countryEntries.slice(0, 3).map(([country]) => (
                  <div
                    key={country}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-full border border-gray-100"
                  >
                    <MapPin className="w-3 h-3" />
                    {country}
                  </div>
                ))}
                {countryEntries.length > 3 && (
                  <div className="text-xs text-gray-500 px-2 py-1">
                    +{countryEntries.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </QuestionSearchDialog>
    );
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 -z-10">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-white dark:from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find questions by keyword, country, topic, and more
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                value={searchFilters.keyword}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, keyword: e.target.value }))}
                placeholder="Search by keywords..."
                className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#EECE84]/20 focus:border-[#EECE84] transition-all duration-200"
              />

              <ExaminingAuthorityCard
                selectedCountry={searchFilters.country}
                onCountryChange={handleCountryChange}
              />

              <div className="w-full flex justify-center text-black">
                <Topics
                  onSelectionChange={handleTopicChange}
                  selectedTopic={searchFilters.topicId || 'all'}
                  selectedTopicName={selectedTopicName}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={searchFilters.lastExam === true}
                  onChange={(e) => handleLastExamChange(e.target.checked)}
                  className="rounded border-gray-300 text-[#EECE84] focus:ring-[#EECE84]"
                />
                Only show questions from last exam
              </label>

              <button
                type="submit"
                disabled={isSearchButtonDisabled || isLoading}
                className={`bg-[#EECE84] hover:bg-[#EECE84]/90 text-gray-900 rounded-[12px] px-6 h-10 flex items-center gap-2 font-medium transition-colors ${isSearchButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-[#EECE84]/20 border-t-[#EECE84] rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : results ? (
            <>
              {results.total_question > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Found {results.total_question} question{results.total_question !== 1 ? 's' : ''}
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {results.questions.map(renderQuestionCard)}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No questions found. Try different search criteria.</p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;