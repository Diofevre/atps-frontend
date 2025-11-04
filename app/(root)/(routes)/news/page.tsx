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
      <div className="min-h-screen bg-main-gradient flex items-center justify-center">
        <div className="text-center text-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-main-gradient">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Aviation News</h1>
        
        {/* Featured Article */}
        {featured && (
          <div className="mb-12">
            <Link href={`/news/${featured.titleSlug}`}>
              <article className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                {/* Background Image */}
                <div 
                  className="relative h-[500px] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${featured.featuredImageUrl || '/placeholder-news.jpg'})`
                  }}
                >
                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <div className="max-w-4xl">
                      <span className="inline-block px-4 py-2 bg-atps-yellow text-[#111111] text-sm font-semibold rounded-full mb-4">
                        Featured
                      </span>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 group-hover:text-atps-yellow transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-white/90 mb-6 text-lg leading-relaxed line-clamp-2">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center text-white text-sm">
                        <span>{new Date(featured.publishedAt).toLocaleDateString()} {new Date(featured.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="mx-2">•</span>
                        <span>{featured.readingTimeMinutes} min read</span>
                      </div>
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
    </div>
  );
}
