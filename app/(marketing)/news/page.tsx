'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Calendar, Clock, Lock } from 'lucide-react';

const mockArticles = [
  {
    id: '1',
    title: 'Latest EASA Regulatory Updates for ATPL Training',
    slug: 'easa-regulatory-updates-atpl',
    excerpt: 'Stay informed about the latest EASA regulations affecting ATPL training and certification requirements.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    date: '2025-02-15',
    readTime: 5,
  },
  {
    id: '2',
    title: 'Industry Trends in Aviation Recruitment',
    slug: 'aviation-recruitment-trends',
    excerpt: 'Discover the current trends in aviation recruitment and what airlines are looking for in new pilots.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    date: '2025-02-10',
    readTime: 8,
  },
  {
    id: '3',
    title: 'Best Practices for Mass and Balance Calculations',
    slug: 'mass-balance-calculations',
    excerpt: 'Expert tips and best practices for accurate mass and balance calculations in ATPL exams.',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
    date: '2025-02-05',
    readTime: 6,
  },
];

const NewsPublicPage = () => {
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
            <span className="text-[#EECE84] text-sm font-medium">Aviation News</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            ATPS Aviation Journal
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Stay informed with the latest aviation industry updates, regulatory changes, and training insights
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
              <h3 className="text-xl font-bold text-white mb-2">Full Content Requires Authentication</h3>
              <p className="text-gray-300 mb-4">
                You're viewing a preview of our aviation news. Sign up or log in to access full articles, participate in discussions, and save your favorite content.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-atps-yellow text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition-all hover:scale-105"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-2 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockArticles.map((article, index) => (
            <motion.article
              key={article.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-atps-yellow/50 transition-all duration-300 hover:shadow-2xl hover:shadow-atps-yellow/10 hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/0 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-atps-yellow transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} min read</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg text-sm text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span>Authentication Required</span>
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
              Ready to Access Full Content?
            </h2>
            <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of aspiring pilots using ATPS to master their ATPL training and stay ahead in their aviation journey
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-atps-yellow text-gray-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all hover:scale-105 shadow-xl"
            >
              Get Started Free
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsPublicPage;

