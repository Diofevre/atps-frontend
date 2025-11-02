'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Lock, Tag } from 'lucide-react';

const mockPosts = [
  {
    id: '1',
    title: 'Essential Pre-Flight Checks Every Pilot Should Know',
    slug: 'essential-pre-flight-checks',
    excerpt: 'Learn the critical pre-flight inspection procedures that ensure safety before every flight.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    category: 'Safety',
    tags: ['pre-flight', 'safety', 'checklist'],
    date: '2025-02-20',
    readTime: 8,
  },
  {
    id: '2',
    title: 'Understanding Weather Patterns for Pilots',
    slug: 'understanding-weather-patterns',
    excerpt: 'Master the fundamentals of weather interpretation and how it affects flight operations.',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
    category: 'Training',
    tags: ['weather', 'meteorology', 'training'],
    date: '2025-02-15',
    readTime: 12,
  },
  {
    id: '3',
    title: 'Advanced Navigation Techniques in Modern Aviation',
    slug: 'advanced-navigation-techniques',
    excerpt: 'Explore cutting-edge navigation technologies and techniques used in modern aviation.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    category: 'Tips & Guides',
    tags: ['navigation', 'technology', 'advanced'],
    date: '2025-02-10',
    readTime: 10,
  },
];

const categories = ['All Posts', 'Safety', 'Training', 'Tips & Guides', 'Case Studies', 'Industry'];

const BlogPublicPage = () => {
  const [activeCategory, setActiveCategory] = React.useState('All Posts');

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#EECE84]/10 border border-[#EECE84]/20 backdrop-blur-sm mb-6">
            <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-[#EECE84]"></span>
            <span className="text-[#EECE84] text-sm font-medium">Aviation Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            ATPS Aviation Blog
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Expert insights, training tips, and industry knowledge for aspiring pilots
          </p>
        </motion.div>

        {/* Auth Notice Banner */}
        <motion.div
          className="mb-12 p-6 bg-gradient-to-r from-atps-yellow/10 to-yellow-500/10 border border-atps-yellow/30 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-atps-yellow/20 rounded-full">
              <Lock className="w-6 h-6 text-atps-yellow" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Full Articles Require Authentication</h3>
              <p className="text-gray-300 mb-4">
                Preview our expert aviation content. Create a free account to read full articles, save favorites, and receive personalized recommendations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-atps-yellow text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition-all hover:scale-105"
                >
                  Start Reading
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories Filter */}
        <motion.div
          className="flex flex-wrap gap-3 mb-12 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-atps-yellow text-gray-900 scale-105 shadow-lg shadow-atps-yellow/30'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-atps-yellow/50 transition-all duration-300 hover:shadow-2xl hover:shadow-atps-yellow/5 hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/0 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-atps-yellow text-gray-900 rounded-full text-xs font-bold">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 text-gray-400 rounded-md text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-atps-yellow transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {post.readTime} min
                    </div>
                  </div>
                </div>

                {/* Lock Indicator */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg text-sm text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span>Full Article Locked</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="inline-block p-12 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-slate-700 rounded-3xl backdrop-blur-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Unlock Full Access to Expert Content
            </h2>
            <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
              Join ATPS to access all articles, training guides, and aviation insights
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-atps-yellow text-gray-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all hover:scale-105 shadow-xl"
            >
              Start Free Trial
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPublicPage;

