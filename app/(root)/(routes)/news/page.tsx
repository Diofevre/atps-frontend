'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';
import NewsCard from '@/components/news/NewsCard';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  titleSlug: string;
  excerpt: string;
  featuredImageUrl: string;
  publishedAt: string;
  readingTimeMinutes: number;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export default function NewsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isLoading } = useKeycloakAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [featured, setFeatured] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch news only if authenticated
    if (isAuthenticated && !isLoading) {
      fetchNews();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchNews = async () => {
    try {
      // Get access token
      const token = localStorage.getItem('keycloak_tokens');
      const tokens = token ? JSON.parse(token) : null;
      const accessToken = tokens?.access_token;

      // Fetch featured first
      const featuredRes = await fetch('/api/news/featured', {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        },
      });
      const featuredData = await featuredRes.json();
      
      if (featuredData.success && featuredData.featured) {
        setFeatured(featuredData.featured);
      }

      // Fetch all articles
      const response = await fetch('/api/news', {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        },
      });
      const data = await response.json();
      
      if (data.success && data.articles) {
        // Filter out the featured article from the list
        const featuredSlug = featuredData.success && featuredData.featured 
          ? featuredData.featured.titleSlug 
          : null;
        
        const otherArticles = featuredSlug 
          ? data.articles.filter((article: Article) => article.titleSlug !== featuredSlug)
          : data.articles;
        
        setArticles(otherArticles || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Aviation News</h1>
        
        {/* Featured Article */}
        {featured && (
          <div className="mb-12">
            <Link href={`/news/${featured.titleSlug}`}>
              <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={featured.featuredImageUrl || '/placeholder-news.jpg'}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <span className="text-sm text-blue-600 font-semibold">Featured</span>
                    <h2 className="text-3xl font-bold mt-2 mb-4">{featured.title}</h2>
                    <p className="text-gray-600 mb-4">{featured.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{new Date(featured.publishedAt).toLocaleDateString()} {new Date(featured.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="mx-2">•</span>
                      <span>{featured.readingTimeMinutes} min read</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
    </div>
  );
}
