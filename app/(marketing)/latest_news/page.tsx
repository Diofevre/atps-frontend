/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useCallback } from 'react';
import { Calendar, Clock, Globe } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from 'swr';

interface Article {
  title: string;
  link: string;
  pubDate: string;
  image: string;
  content: string;
}

interface NewsData {
  article: Article;
  recentArticles: Article[];
}

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then(res => res.json());

const MainArticleSkeleton = () => (
  <div className="bg-slate-700 rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="relative">
      <Skeleton className="w-full h-96" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Skeleton className="h-8 w-3/4 mb-2" />
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-6 mb-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="mt-6">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);

const RecentArticleSkeleton = () => (
  <div className="bg-slate-700 rounded-lg shadow-md overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-4">
      <Skeleton className="h-5 w-32 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const LatestNews = () => {
  const { data: newsData, error, isLoading, mutate } = useSWR<NewsData>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/latest-news`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const handleArticleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, link: string, clickedArticle: Article) => {
    e.preventDefault();
    mutate(prevData => {
      if (!prevData) return undefined;
      return {
        ...prevData,
        article: clickedArticle,
      };
    }, false);
    setExpandedContent(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mutate]);

  const handleReturnToMain = useCallback(() => {
    mutate(prevData => {
      if (!prevData) return undefined;
      return {
        ...prevData,
        article: initialArticleRef.current!,
      };
    }, false);
    setExpandedContent(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mutate]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const [expandedContent, setExpandedContent] = React.useState(false);
  const initialArticleRef = React.useRef<Article | null>(newsData?.article || null);

  React.useEffect(() => {
    initialArticleRef.current = newsData?.article || null;
  }, [newsData?.article]);

  const isNotMainArticle = initialArticleRef.current && newsData?.article.link !== initialArticleRef.current.link;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 relative">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-6 w-6 text-[#EECE84]" />
            <span className="text-[#EECE84] font-medium tracking-wide">Aviation News Network</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Actualités Aéronautiques
          </h1>
          <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
            Découvrez les dernières actualités et innovations du monde de l&apos;aviation.
            Des analyses approfondies et des informations exclusives sur l&apos;industrie aéronautique.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article */}
          <div className="lg:col-span-8">
            {isNotMainArticle && (
              <button
                onClick={handleReturnToMain}
                className="mb-6 group flex items-center gap-2 px-4 py-2 bg-[#EECE84] text-black/80 rounded-full text-sm hover:bg-[#EECE84]/90 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#EECE84] focus:ring-offset-2"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform duration-200">
                  ←
                </span>
                Retour à l&apos;article principal
              </button>
            )}
            
            {isLoading ? (
              <MainArticleSkeleton />
            ) : error ? (
              <div className="flex items-center justify-center p-8 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-500 font-medium">Une erreur est survenue lors du chargement des actualités.</p>
              </div>
            ) : newsData && (
              <article className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl mt-2">
                <div className="relative">
                  <img
                    src={newsData.article.image}
                    alt={newsData.article.title}
                    className="w-full h-96 object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h2 className="text-3xl font-bold text-white leading-tight">
                      <a
                        href={newsData.article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#EECE84] transition-colors duration-200"
                      >
                        {newsData.article.title}
                      </a>
                    </h2>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#EECE84]" />
                      <span>{formatDate(newsData.article.pubDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#EECE84]" />
                      <span>{formatTime(newsData.article.pubDate)}</span>
                    </div>
                  </div>
                  <div
                    className={`prose prose-lg max-w-none text-gray-600 ${
                      expandedContent ? 'max-h-none' : 'max-h-[500px] overflow-hidden relative'
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: newsData.article.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') }} />
                    {!expandedContent && (
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
                    )}
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={() => setExpandedContent(!expandedContent)}
                      className="px-6 py-3 bg-[#EECE84] text-black/80 rounded-full text-sm hover:bg-[#EECE84]/90 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#EECE84] focus:ring-offset-2"
                    >
                      {expandedContent ? 'Voir moins' : 'Lire la suite'}
                    </button>
                  </div>
                </div>
              </article>
            )}
          </div>

          {/* Recent Articles List */}
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold mb-6 text-white">Dernières Actualités</h2>
            <div className="space-y-6">
              {isLoading ? (
                <>
                  <RecentArticleSkeleton />
                  <RecentArticleSkeleton />
                  <RecentArticleSkeleton />
                </>
              ) : newsData?.recentArticles.map((article) => (
                <article
                  key={article.link}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg ${
                    article.link === newsData.article.link ? 'ring-2 ring-[#EECE84]' : ''
                  }`}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar size={14} className="text-[#EECE84]" />
                      <span>{formatDate(article.pubDate)}</span>
                    </div>
                    <h3 className="font-medium text-gray-900">
                      <a
                        href="#"
                        onClick={(e) => handleArticleClick(e, article.link, article)}
                        className={`hover:text-[#EECE84] transition-colors ${
                          article.link === newsData.article.link ? 'text-[#EECE84]' : ''
                        }`}
                      >
                        {article.title}
                      </a>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestNews;