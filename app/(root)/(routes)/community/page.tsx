'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';

type Post = {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  category: 'general' | 'courses' | 'safety' | 'tips' | 'questions' | 'announcements';
  images?: string[];
  videos?: string[];
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  is_pinned: boolean;
  createdAt: string;
};

const categories = [
  { id: 'all', label: 'All Posts' },
  { id: 'general', label: 'General' },
  { id: 'courses', label: 'Courses' },
  { id: 'safety', label: 'Safety' },
  { id: 'tips', label: 'Tips & Tricks' },
  { id: 'questions', label: 'Questions' },
  { id: 'announcements', label: 'Announcements' },
];

export default function CommunityPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isLoading } = useKeycloakAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Mock data for now - will be replaced with real data later
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Welcome to the ATPS Community!',
      content: 'This is your space to discuss aviation topics, share experiences, and connect with fellow pilots and students. Feel free to share your thoughts, ask questions, or provide tips!',
      author: {
        name: 'ATPS Team',
        username: 'atps_admin',
        avatar: '/avatar-placeholder.png',
      },
      category: 'announcements',
      tags: ['welcome', 'community'],
      likes: 42,
      comments: 8,
      views: 156,
      is_pinned: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Best Practices for Mass & Balance Calculations',
      content: 'When calculating mass and balance, always double-check your weight and arm calculations. Here are some tips that helped me during my exams...',
      author: {
        name: 'John Doe',
        username: 'johndoe',
        avatar: '/avatar-placeholder.png',
      },
      category: 'tips',
      tags: ['mass-balance', 'tips', 'study'],
      likes: 28,
      comments: 12,
      views: 89,
      is_pinned: false,
      images: ['/placeholder-image.jpg'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Question about Air Law Regulations',
      content: 'Can someone explain the difference between VFR and IFR flight rules? I\'m having trouble understanding the visibility requirements.',
      author: {
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: '/avatar-placeholder.png',
      },
      category: 'questions',
      tags: ['air-law', 'vfr', 'ifr', 'help'],
      likes: 15,
      comments: 6,
      views: 67,
      is_pinned: false,
      createdAt: new Date().toISOString(),
    },
  ];

  // Use mock data for now
  const displayPosts = posts.length > 0 ? posts : mockPosts;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">Connect, share, and learn with fellow aviation enthusiasts</p>
      </div>

      {/* Search and Create Post */}
      <div className="mb-6 flex items-center gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search posts, tags, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-atps-yellow focus:border-transparent"
          />
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Create Post Button */}
        <Link
          href="/community/create"
          className="inline-flex items-center px-6 py-3 bg-atps-yellow text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
            <nav className="space-y-2">
              {categories.map((category) => (
                                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeCategory === category.id
                        ? 'bg-yellow-50 text-gray-900 font-semibold border-l-4 border-atps-yellow'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.label}
                  </button>
              ))}
            </nav>

            {/* Trending Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['mass-balance', 'air-law', 'weather', 'navigation', 'study-tips'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/community?tag=${tag}`}
                    className="px-3 py-1 bg-yellow-50 text-gray-900 text-sm rounded-full hover:bg-yellow-100 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Posts */}
        <div className="lg:col-span-3 space-y-6">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow ${
                post.is_pinned ? 'border-2 border-atps-yellow' : ''
              }`}
            >
              {post.is_pinned && (
                <div className="bg-atps-yellow text-gray-900 px-4 py-2 text-sm font-semibold flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-5-2.5L5 21V5z" />
                  </svg>
                  Pinned Post
                </div>
              )}

              <div className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author.name}</p>
                      <p className="text-sm text-gray-500">@{post.author.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.category === 'announcements' ? 'bg-red-100 text-red-700' :
                      post.category === 'tips' ? 'bg-green-100 text-green-700' :
                      post.category === 'questions' ? 'bg-yellow-100 text-yellow-700' :
                      post.category === 'safety' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {categories.find(c => c.id === post.category)?.label || 'General'}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <Link href={`/community/${post.id}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-atps-yellow transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                </Link>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt="Post image"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-atps-yellow transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-atps-yellow transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{post.comments}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{post.views}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
