/* eslint-disable @next/next/no-img-element */
'use client'

import { Loader } from '@/components/ui/loader';
import { Compass, Globe } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
  title_image: string;
  title_text: string;
}

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`)
      .then(response => response.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      });
  }, []);

  const navigateToArticle = (id: number) => {
    window.location.href = `/articles/${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/80 backdrop-blur-xl">
      {/* Navigation Indicator */}
      <div className="absolute top-8 left-8 flex items-center gap-2 text-[#94A3B8]">
        <Compass className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-medium">ATPS Aviation / Blog</span>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2048')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 relative">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-6 w-6 text-[#EECE84]" />
            <span className="text-[#EECE84] font-medium">
              Aviation Knowledge Hub
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Explore Aviation Articles
          </h1>
          <p className="text-xl text-white/50 max-w-2xl">
            Discover in-depth articles about aviation, from flight training to advanced techniques.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group cursor-pointer"
              onClick={() => navigateToArticle(article.id)}
            >
              <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:border-[#EECE84]/20 hover:transform hover:-translate-y-1">
                <div className="relative h-48">
                  <img
                    src={article.title_image}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-[#EECE84] transition-colors duration-300">
                    {article.title}
                  </h2>
                  <p className="text-gray-400 line-clamp-2">
                    {article.title_text}
                  </p>
                  <div className="mt-4 inline-flex items-center text-[#EECE84] text-sm">
                    Read more
                    <svg
                      className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;