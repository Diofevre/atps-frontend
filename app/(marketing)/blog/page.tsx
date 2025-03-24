/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react';
import { Globe, Clock, ArrowRight } from 'lucide-react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  id: number;
  title: string;
  title_image: string;
  title_text: string;
}

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then(res => res.json());

const ArticleSkeleton = () => (
  <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl overflow-hidden">
    <div className="relative">
      <Skeleton className="h-52 w-full" />
      <div className="absolute top-4 left-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

const Blog = () => {
  const router = useRouter();
  const { data: articles, error, isLoading } = useSWR<Article[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
    fetcher
  );

  const navigateToArticle = (id: number) => {
    router.push(`/articles/${id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg border border-red-500/20">
          Failed to load articles
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/80 backdrop-blur-xl">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2048')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 relative">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-6 w-6 text-[#EECE84]" />
            <span className="text-[#EECE84] font-medium">
              Aviation Knowledge Hub
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
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
          {isLoading ? (
            <>
              <ArticleSkeleton />
              <ArticleSkeleton />
              <ArticleSkeleton />
            </>
          ) : (
            articles?.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer"
                onClick={() => navigateToArticle(article.id)}
              >
                <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:border-[#EECE84]/20 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#EECE84]/5">
                  <div className="relative">
                    <div className="h-52 overflow-hidden">
                      <img
                        src={article.title_image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#EECE84]/10 text-[#EECE84] text-sm rounded-full border border-[#EECE84]/20">
                        Aviation
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-[#EECE84] transition-colors duration-300">
                        {article.title}
                      </h2>
                      <p className="text-gray-400 line-clamp-2">
                        {article.title_text}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                      <div className="flex items-center text-sm text-slate-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>5 min read</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-[#EECE84]/10 flex items-center justify-center group-hover:bg-[#EECE84]/20 transition-colors duration-300">
                        <ArrowRight className="w-4 h-4 text-[#EECE84]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;