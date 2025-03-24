/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useCallback } from 'react';
import { Calendar, Clock, Globe } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
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

const LatestNews = () => {
  const { data: newsData, error, isLoading, mutate } = useSWR<NewsData>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/latest-news`,
    fetcher
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



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading news.
      </div>
    );
  }

  const isNotMainArticle = initialArticleRef.current && newsData.article.link !== initialArticleRef.current.link;


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 relative">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-6 w-6 text-[#EECE84]" />
            <span className="text-[#EECE84] font-medium">Aviation News Network</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">Actualités Aéronautiques</h1>
          <p className="text-xl text-white/70 max-w-2xl">
            Découvrez les dernières actualités et innovations du monde de l&apos;aviation.
            Des analyses approfondies et des informations exclusives sur l&apos;industrie aéronautique.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article */}
          <div className="lg:col-span-8">
            {isNotMainArticle && (
              <button
                onClick={handleReturnToMain}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#EECE84] text-black/80 rounded-[24px] text-sm hover:bg-[#EECE84]/60 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#EECE84] focus:ring-offset-2"
              >
                <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                  ←
                </span>
                Retour à l&apos;article principal
              </button>
            )}
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={newsData.article.image}
                  alt={newsData.article.title}
                  className="w-full h-96 object-cover"
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white">
                    <a
                      href={newsData.article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#EECE84] transition-colors"
                    >
                      {newsData.article.title}
                    </a>
                  </h2>
                </div>
              </div>
              <div className="p-6">
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
                  <div dangerouslySetInnerHTML={{ __html: newsData.article.content }} />
                  {!expandedContent && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedContent(!expandedContent)}
                    className="px-6 py-2 bg-[#EECE84]/50 text-black/80 rounded-[12px] text-sm hover:bg-[#EECE84]/20 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#EECE84] focus:ring-offset-2"
                  >
                    {expandedContent ? 'Voir moins' : 'Lire la suite'}
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Recent Articles List */}
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold mb-6">Dernières Actualités</h2>
            <div className="space-y-6">
              {newsData.recentArticles.map((article) => (
                <article
                  key={article.link}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transform hover:translate-y-[-2px] transition-all duration-200 ${
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
                    <h3 className="mb-2 text-black text-sm">
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