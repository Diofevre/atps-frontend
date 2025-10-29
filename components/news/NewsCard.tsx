'use client';

import Link from 'next/link';

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    titleSlug: string;
    excerpt: string;
    featuredImageUrl: string;
    publishedAt: string;
    readingTimeMinutes: number;
  };
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/news/${article.titleSlug}`}>
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full">
        <div className="relative h-48">
          <img
            src={article.featuredImageUrl || '/placeholder-news.jpg'}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image failed to load:', article.featuredImageUrl);
              e.currentTarget.src = '/placeholder-news.jpg';
            }}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center text-xs text-gray-500">
            <span>{new Date(article.publishedAt).toLocaleDateString()} {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="mx-2">•</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
