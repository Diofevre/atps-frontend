'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';
import { Clock, Calendar, ArrowRight, Tag, Filter } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: 'training' | 'safety' | 'tips' | 'case-studies' | 'industry';
  tags: string[];
  readingTime: number;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

const categories = [
  { id: 'all', label: 'All Posts', color: 'bg-gray-100 text-gray-700' },
  { id: 'training', label: 'Training', color: 'bg-blue-100 text-blue-700' },
  { id: 'safety', label: 'Safety', color: 'bg-red-100 text-red-700' },
  { id: 'tips', label: 'Tips & Guides', color: 'bg-green-100 text-green-700' },
  { id: 'case-studies', label: 'Case Studies', color: 'bg-purple-100 text-purple-700' },
  { id: 'industry', label: 'Industry News', color: 'bg-yellow-100 text-yellow-700' },
];

// Mock data
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Essential Pre-Flight Checks Every Pilot Should Know',
    slug: 'essential-pre-flight-checks-every-pilot-should-know',
    excerpt: 'Learn the critical pre-flight inspection procedures that ensure safety before every flight. This comprehensive guide covers all essential checks.',
    featuredImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    category: 'safety',
    tags: ['pre-flight', 'safety', 'checklist'],
    readingTime: 8,
    publishedAt: '2024-01-15',
    author: { name: 'Captain Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson' },
  },
  {
    id: '2',
    title: 'Understanding Weather Patterns for Pilots',
    slug: 'understanding-weather-patterns-for-pilots',
    excerpt: 'Master the fundamentals of weather interpretation and how it affects flight operations. Essential knowledge for all aviators.',
    featuredImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
    category: 'training',
    tags: ['weather', 'meteorology', 'training'],
    readingTime: 12,
    publishedAt: '2024-01-12',
    author: { name: 'Meteorologist Mike Chen', avatar: 'https://ui-avatars.com/api/?name=Mike+Chen' },
  },
  {
    id: '3',
    title: 'Advanced Navigation Techniques in Modern Aviation',
    slug: 'advanced-navigation-techniques-modern-aviation',
    excerpt: 'Explore cutting-edge navigation technologies and techniques used in modern commercial and private aviation.',
    featuredImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    category: 'tips',
    tags: ['navigation', 'technology', 'advanced'],
    readingTime: 10,
    publishedAt: '2024-01-10',
    author: { name: 'Aviation Expert Lisa Wong', avatar: 'https://ui-avatars.com/api/?name=Lisa+Wong' },
  },
];

export default function BlogPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isLoading } = useKeycloakAuth();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts = activeCategory === 'all' 
    ? mockPosts 
    : mockPosts.filter(post => post.category === activeCategory);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C1E0F1] via-white to-[#C1E0F1]/50">
      {/* Hero Section - Aesthetic Abstract Design */}
      <div className="relative overflow-hidden">
        {/* Abstract Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
        
        {/* Geometric Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/5 to-transparent rounded-full blur-3xl" />
        
        {/* Content Layer */}
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative Elements */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
              <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Blog</span>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Aviation Insights
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Expert insights, training tips, and industry knowledge<br />
              <span className="text-sm text-gray-500">for aviation professionals</span>
            </p>
            
            {/* Decorative Accent */}
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          </div>
        </div>
        
        {/* Bottom Wave Divider */}
        <svg className="absolute bottom-0 left-0 w-full h-16 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Categories Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'scale-105 shadow-lg'
                  : 'hover:scale-102'
              } ${
                activeCategory === category.id
                  ? category.color
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {activeCategory === 'all' && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <Link href={`/blog/${mockPosts[0].slug}`}>
                <div className="md:flex">
                  <div className="md:w-1/2 h-96 md:h-auto">
                    <img
                      src={mockPosts[0].featuredImage}
                      alt={mockPosts[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-atps-yellow text-gray-900 rounded-full text-sm font-medium">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                        {mockPosts[0].category.replace('-', ' ')}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                      {mockPosts[0].title}
                    </h2>
                    <p className="text-gray-600 mb-6 text-lg">
                      {mockPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>{mockPosts[0].readingTime} min read</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(mockPosts[0].publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts
            .filter((_, index) => activeCategory === 'all' ? index > 0 : true)
            .map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 capitalize shadow-md">
                      {post.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs text-gray-500"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-atps-yellow to-yellow-600 flex items-center justify-center text-gray-900 text-sm font-bold">
                        {post.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {post.readingTime} min
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
