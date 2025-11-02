'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Lock, Users, Heart, Eye, Calendar } from 'lucide-react';

const mockPosts = [
  {
    id: '1',
    title: 'Welcome to the ATPS Community!',
    content: 'This is your space to discuss aviation topics, share experiences, and connect with fellow pilots and students...',
    author: 'ATPS Team',
    category: 'Announcements',
    likes: 42,
    comments: 8,
    views: 156,
    date: '2025-01-20',
    pinned: true,
  },
  {
    id: '2',
    title: 'Best Practices for Mass & Balance Calculations',
    content: 'When calculating mass and balance, always double-check your weight and arm calculations...',
    author: 'John D.',
    category: 'Tips & Tricks',
    likes: 28,
    comments: 12,
    views: 89,
    date: '2025-01-18',
    pinned: false,
  },
  {
    id: '3',
    title: 'Question about Air Law Regulations',
    content: 'Can someone explain the difference between VFR and IFR flight rules?',
    author: 'Jane S.',
    category: 'Questions',
    likes: 15,
    comments: 6,
    views: 67,
    date: '2025-01-15',
    pinned: false,
  },
];

const categories = [
  { id: 'all', label: 'All Posts' },
  { id: 'general', label: 'General' },
  { id: 'tips', label: 'Tips & Tricks' },
  { id: 'questions', label: 'Questions' },
  { id: 'announcements', label: 'Announcements' },
];

const CommunityPublicPage = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');

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
            <MessageCircle className="w-4 h-4 mr-2 text-[#EECE84] animate-pulse" />
            <span className="text-[#EECE84] text-sm font-medium">Aviation Community</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            ATPS Aviation Community
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Connect, share, and learn with fellow aviation enthusiasts around the world
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
              <h3 className="text-xl font-bold text-white mb-2">Join the Conversation</h3>
              <p className="text-gray-300 mb-4">
                You're viewing our community preview. Create a free account to participate in discussions, ask questions, share insights, and connect with fellow pilots.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-atps-yellow text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition-all hover:scale-105"
                >
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700 p-6 sticky top-32 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeCategory === category.id
                        ? 'bg-atps-yellow/20 text-white font-semibold border-l-4 border-atps-yellow'
                        : 'text-gray-400 hover:bg-slate-800/50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content - Posts */}
          <div className="lg:col-span-3 space-y-6">
            {mockPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border overflow-hidden hover:shadow-xl transition-shadow backdrop-blur-sm ${
                  post.pinned ? 'border-2 border-atps-yellow/50' : 'border-slate-700'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                {post.pinned && (
                  <div className="bg-atps-yellow/20 text-gray-900 px-4 py-2 text-sm font-semibold flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Pinned Post
                  </div>
                )}

                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-atps-yellow to-yellow-600 rounded-full flex items-center justify-center text-gray-900 font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{post.author}</p>
                        <p className="text-sm text-gray-500">@aviation_pilot</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-400/30">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <h2 className="text-2xl font-bold text-white mb-3 hover:text-atps-yellow transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 mb-6 line-clamp-3">{post.content}</p>

                  {/* Post Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                        <Heart className="w-5 h-5" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Eye className="w-5 h-5" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Lock Indicator */}
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg text-sm text-gray-400">
                      <Lock className="w-4 h-4" />
                      <span>Join to participate</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="inline-block p-12 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-slate-700 rounded-3xl backdrop-blur-xl">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-atps-yellow/20 rounded-full">
              <Users className="w-10 h-10 text-atps-yellow" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Connect with Aviation Experts?
            </h2>
            <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of pilots and students sharing knowledge, experiences, and supporting each other's journey to becoming certified pilots
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-atps-yellow text-gray-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all hover:scale-105 shadow-xl"
            >
              Join the Community
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityPublicPage;

