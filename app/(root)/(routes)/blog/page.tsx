'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';
import { Clock, Calendar, ArrowRight, Tag, Filter, Mail, Check } from 'lucide-react';

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
  { id: 'all', label: 'All Posts', color: 'bg-blue-100 text-blue-700' },
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
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const filteredPosts = activeCategory === 'all' 
    ? mockPosts 
    : mockPosts.filter(post => post.category === activeCategory);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription for:', email);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white border-b border-blue-200">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent" />
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">
                Aviation Blog
              </h1>
              <p className="text-lg text-gray-600">
                Expert insights, training tips, and industry knowledge
              </p>
            </div>

            <div>
              {!isSubscribed ? (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-atps-yellow text-gray-900 rounded-full font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-full text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Thanks for subscribing!</span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-3">
                Get the latest aviation insights delivered to your inbox
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Featured Post */}
        {activeCategory === 'all' && (
          <div className="mb-16">
            <Link href={`/blog/${mockPosts[0].slug}`}>
              <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 h-96 md:h-[500px] relative overflow-hidden">
                    <img
                      src={mockPosts[0].featuredImage}
                      alt={mockPosts[0].title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
                  </div>
                  
                  <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-4 py-2 bg-atps-yellow text-gray-900 rounded-full text-sm font-bold">
                        FEATURED
                      </span>
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                        {mockPosts[0].category.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {mockPosts[0].title}
                    </h2>
                    
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      {mockPosts[0].excerpt}
                    </p>
                    
                    <div className="flex items-center gap-8 text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">{mockPosts[0].readingTime} min read</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(mockPosts[0].publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {mockPosts[0].author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{mockPosts[0].author.name}</p>
                        <p className="text-gray-600 text-sm">Aviation Expert</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white scale-105 shadow-lg shadow-blue-500/30'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts
            .filter((_, index) => activeCategory === 'all' ? index > 0 : true)
            .map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="group relative h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 ${categories.find(c => c.id === post.category)?.color || 'bg-blue-100 text-blue-700'} rounded-full text-xs font-bold capitalize shadow-lg`}>
                      {post.category.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {post.author.name.charAt(0)}
                      </div>
                      <p className="text-sm text-gray-700">{post.author.name.split(' ')[0]}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {post.readingTime} min
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <Filter className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No posts found</h3>
            <p className="text-gray-600 text-lg">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
