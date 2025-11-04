'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';

interface Article {
  id: string;
  title: string;
  titleSlug: string;
  excerpt: string;
  contentHtml: string;
  featuredImageUrl: string;
  publishedAt: string;
  readingTimeMinutes: number;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export default function NewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isLoading } = useKeycloakAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (params.slug && isAuthenticated) {
      fetchArticle(params.slug as string);
    }
  }, [params.slug, isAuthenticated, isLoading, router]);

  const fetchArticle = async (slug: string) => {
    try {
      // Get access token
      const token = localStorage.getItem('keycloak_tokens');
      const tokens = token ? JSON.parse(token) : null;
      const accessToken = tokens?.access_token;

      const response = await fetch(`/api/news/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        },
      });
      const data = await response.json();
      
      if (data.success && data.article) {
        setArticle(data.article);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (isLoading || loading) {
    return (
      
        <div className="container mx-auto px-4 py-8 bg-background">
          <div className="text-center text-foreground">Loading...</div>
        </div>
      
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (!article) {
    return (
      
        <div className="container mx-auto px-4 py-8 bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Article not found</h1>
            <Link href="/news" className="text-blue-600 dark:text-blue-400 hover:underline">
              Back to News
            </Link>
          </div>
        </div>
      
    );
  }

  return (
    
      <div className="container mx-auto px-4 py-8 max-w-4xl bg-background">
        {/* Back button */}
        <Link 
          href="/news"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
        >
          ← Back to News
        </Link>

        {/* Featured image */}
        {article.featuredImageUrl && (
          <div className="mb-8">
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              onError={(e) => {
                console.error('Image failed to load:', article.featuredImageUrl);
                e.currentTarget.src = '/placeholder-news.jpg';
              }}
            />
          </div>
        )}

        {/* Categories */}
        {article.categories && article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.categories.map((category) => (
              <span
                key={category.id}
                className="px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 text-foreground">{article.title}</h1>

        {/* Meta info */}
        <div className="flex items-center text-text-secondary mb-8 pb-6 border-b border-border">
          <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
          <span className="mx-3">•</span>
          <span>{article.readingTimeMinutes} min read</span>
        </div>

        {/* Excerpt */}
        <p className="text-xl text-text-secondary mb-8 italic">{article.excerpt}</p>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-text-secondary prose-a:text-blue-600 dark:prose-a:text-blue-400"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Back to news */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link 
            href="/news"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    
  );
}
