'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SimpleQuestion {
  id: number;
  question_text: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  question_images?: string[];
  explanation_images?: string[];
}

const SimpleQuiz = () => {
  const [questions, setQuestions] = useState<SimpleQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('🔍 Fetching questions...');
        
        // Récupérer les paramètres depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        
        if (!dataParam) {
          throw new Error('No data parameter found');
        }

        const quizData = JSON.parse(decodeURIComponent(dataParam));
        console.log('📊 Quiz data:', quizData);

        // Construire l'URL de l'API
        const queryParams = new URLSearchParams({
          chapters: quizData.chapters.join(','),
          subChapters: quizData.subChapters.join(','),
          questionCount: quizData.questionCount.toString(),
          subject_code: '033'
        });

        const apiUrl = `http://localhost:3001/api/questions-v2/quiz?${queryParams.toString()}`;
        console.log('🔗 API URL:', apiUrl);

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        console.log('📡 API Response:', result);

        if (!result.success || !result.data || result.data.length === 0) {
          throw new Error('No questions found');
        }

        // Formater les questions
        const formattedQuestions = result.data.map((q: any) => {
          // Extraire le texte d'explication
          let explanationText = '';
          if (q.explanation && q.explanation.blocks) {
            explanationText = q.explanation.blocks
              .map((block: any) => block.text)
              .join('\n\n');
          } else if (typeof q.explanation === 'string') {
            explanationText = q.explanation;
          }

          // Nettoyer les artefacts
          explanationText = explanationText
            .replace(/__UNDERLINE_\d+__/g, '')
            .replace(/<strong>(.*?)<\/strong>/g, '<u>$1</u>')
            .replace(/<b>(.*?)<\/b>/g, '<u>$1</u>');

          return {
            id: parseInt(q.question_id),
            question_text: q.question_text,
            answer: q.answer,
            options: q.options,
            explanation: explanationText,
            question_images: q.question_images || [],
            explanation_images: q.explanation_images || []
          };
        });

        setQuestions(formattedQuestions);
        console.log('✅ Questions loaded:', formattedQuestions.length);

      } catch (err) {
        console.error('❌ Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Quiz...</h2>
          <p className="text-gray-500">Please wait while we load your questions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Questions Found</h2>
          <p className="text-gray-600">Please check your selection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Flight Planning Quiz</h1>
              <p className="text-sm text-gray-600">Question {currentIndex + 1} of {questions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          {/* Question Images */}
          {currentQuestion.question_images && currentQuestion.question_images.length > 0 && (
            <div className="mb-6">
              {currentQuestion.question_images.map((img, idx) => (
                <img
                  key={idx}
                  src={`/questions/${img}`}
                  alt={`Question ${idx + 1}`}
                  className="max-w-full h-auto rounded-lg shadow-sm border"
                />
              ))}
            </div>
          )}

          {/* Question Text */}
          <div 
            className="mb-6 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: currentQuestion.question_text
                ?.replace(/\n/g, '<br>')
                ?.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline; font-weight: bold;">$1</span>')
                ?.replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
                ?.replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
            }}
          />

          {/* Options */}
          <div className="space-y-3 mb-6">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswerSelect(key)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === key
                    ? selectedAnswer === currentQuestion.answer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : showExplanation && key === currentQuestion.answer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="font-semibold mr-3">{key}.</span>
                {value}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
            >
              <h3 className="font-semibold text-gray-800 mb-2">
                {selectedAnswer === currentQuestion.answer ? '✅ Correct!' : '❌ Incorrect'}
              </h3>
              
              {/* Explanation Images */}
              {currentQuestion.explanation_images && currentQuestion.explanation_images.length > 0 && (
                <div className="mb-4">
                  {currentQuestion.explanation_images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`/questions/${img}`}
                      alt={`Explanation ${idx + 1}`}
                      className="max-w-full h-auto rounded-lg shadow-sm border"
                    />
                  ))}
                </div>
              )}

              {/* Explanation Text */}
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: currentQuestion.explanation
                    ?.replace(/__UNDERLINE_\d+__/g, '')
                    ?.replace(/\n/g, '<br>')
                    ?.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline; font-weight: bold;">$1</span>')
                    ?.replace(/<strong>(.*?)<\/strong>/g, '<strong>$1</strong>')
                    ?.replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
                }}
              />
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            
            <button
              onClick={goToNext}
              disabled={currentIndex === questions.length - 1 || !showExplanation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleQuiz;




