/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react';
import { Calendar, MapPin, School, AlertCircle, BookOpen, Search, Plus, Edit } from 'lucide-react';
import QuestionSearchDialog from '@/app/(root)/(routes)/search/_components/details-search-modal';
import QuestionsForm from './_components/form';

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
  isEditing?: boolean;
  onEdit?: (question: Question) => void;
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

type QuestionsListProps = object

interface QuestionsListState {
  searchFilters: SearchFilters;
  isLoading: boolean;
  results: SearchResponse | null;
  error: string | null;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingQuestionId: number | null;
}

const QuestionsList: React.FC<QuestionsListProps> = () => {
  const [state, setState] = useState<QuestionsListState>({
    searchFilters: {
      keyword: '',
      country: null,
      topicId: null,
      lastExam: null
    },
    isLoading: false,
    results: null,
    error: null,
    isAddModalOpen: false,
    isEditModalOpen: false,
    editingQuestionId: null
  });

  const isSearchButtonDisabled = !state.searchFilters.keyword.trim();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSearchButtonDisabled) return;

    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/tests/search/${encodeURIComponent(state.searchFilters.keyword)}`;
      url += `/${state.searchFilters.country === null ? 'null' : encodeURIComponent(state.searchFilters.country)}`;
      url += `/${state.searchFilters.topicId === null ? 'null' : encodeURIComponent(state.searchFilters.topicId)}`;
      url += `/${state.searchFilters.lastExam === null ? 'null' : state.searchFilters.lastExam}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Search failed');

      const data: SearchResponse = await response.json();
      setState(prevState => ({ ...prevState, results: data }));
    } catch (err) {
      console.error(err);
      setState(prevState => ({ ...prevState, error: 'Failed to fetch results. Please try again.', results: null }));
    } finally {
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    await handleSearch(e);
  };

  const handleModifyQuestion = async (e: React.FormEvent) => {
    await handleSearch(e);
  };

  const handleEditClick = (e: React.MouseEvent, questionId: number) => {
    e.stopPropagation(); // Prevent the search modal from opening
    setState(prevState => ({
      ...prevState,
      editingQuestionId: questionId,
      isEditModalOpen: true,
      isAddModalOpen: false
    }));
  };

  const renderQuestionCard = (question: Question) => {
    const countryEntries = Object.entries(question.countries);
    const totalExams = countryEntries.reduce((acc, [, years]) => {
      return acc + Object.values(years).flat().length;
    }, 0);

    return (
      <QuestionSearchDialog key={question.id} questionId={question.id}>
        <div className="group relative hover:cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-base font-medium text-gray-900">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50">
                    <School className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-lg">Question {question.id}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    {totalExams} exams
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm bg-blue-50 text-blue-700">
                    <BookOpen className="w-3.5 h-3.5" />
                    {question.quality_score}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => handleEditClick(e, question.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                dangerouslySetInnerHTML={{ __html: question.question_text }}
                className="prose prose-sm max-w-none text-gray-700"
              />

              {question.question_images && question.question_images.length > 0 && (
                <div className="relative h-56 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                  <img
                    src={question.question_images[0]}
                    alt="Question illustration"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {countryEntries.slice(0, 3).map(([country]) => (
                  <div
                    key={country}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-gray-50 text-gray-700 rounded-md border border-gray-200"
                  >
                    <MapPin className="w-3 h-3 text-blue-600" />
                    {country}
                  </div>
                ))}
                {countryEntries.length > 3 && (
                  <div className="text-xs text-gray-600 px-2 py-1">
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

  const editingQuestion = state.results?.questions.find(q => q.id === state.editingQuestionId) || null;

  return (
    <div className="min-h-screen">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Question Management</h1>
            <p className="text-gray-600 mt-1">Search and manage examination questions</p>
          </div>
          <button
            onClick={() => setState(prevState => ({
              ...prevState,
              isAddModalOpen: true,
              isEditModalOpen: false,
              editingQuestionId: null
            }))}
            className="bg-[#EECE84] px-5 py-2.5 rounded-[12px] hover:bg-[#EECE84]/90 text-xs transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Question
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={state.searchFilters.keyword}
                    onChange={(e) => setState(prevState => ({
                      ...prevState,
                      searchFilters: { ...prevState.searchFilters, keyword: e.target.value }
                    }))}
                    placeholder="Search by keywords or question ID..."
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchButtonDisabled || state.isLoading}
                  className={`bg-[#EECE84] hover:bg-[#EECE84]/80 text-xs rounded-[12px] px-6 h-10 flex items-center gap-2 font-medium transition-colors ${isSearchButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {state.isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Searching questions...</p>
            </div>
          ) : state.error ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 font-medium">{state.error}</p>
            </div>
          ) : state.results ? (
            <>
              {state.results.total_question > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Found {state.results.total_question} question{state.results.total_question !== 1 ? 's' : ''}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {state.results.questions.map(renderQuestionCard)}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No questions found matching your criteria.</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters.</p>
                </div>
              )}
            </>
          ) : null}
        </div>

        <QuestionsForm
          isOpen={state.isAddModalOpen || state.isEditModalOpen}
          onClose={() => setState(prevState => ({
            ...prevState,
            isAddModalOpen: false,
            isEditModalOpen: false,
            editingQuestionId: null
          }))}
          onAddQuestion={handleAddQuestion}
          searchFiltersKeyword={state.searchFilters.keyword}
          handleSearch={handleSearch}
          editingQuestion={editingQuestion}
          onModifyQuestion={handleModifyQuestion}
        />
      </div>
    </div>
  );
};

export default QuestionsList;