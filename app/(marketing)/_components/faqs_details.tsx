'use client';

import { Separator } from '@/components/ui/separator';
import { ChevronRight, Search } from 'lucide-react';
import React, { useState } from 'react';
import { support } from '@/lib/menu-sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';

const SupportPageMarketing = () => {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = Array.from(new Set(support.map(item => item.category)));

  const filteredSupport = support.filter(item =>
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeCategory === "all" || item.category === activeCategory)
  );

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left Section - Categories and Questions List */}
          <div className="w-full lg:w-[400px]">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t.faqs.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EECE84]/50 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "all"
                    ? "bg-[#EECE84] text-black"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {t.faqs.all}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-[#EECE84] text-black"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              {filteredSupport.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`group relative cursor-pointer transition-all duration-300 ${
                      index === 0 ? 'rounded-t-2xl' : ''
                    } ${index === filteredSupport.length - 1 ? 'rounded-b-2xl' : ''}`}
                    onClick={() => setActiveId(item.id)}
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`relative flex items-center justify-between p-6 ${
                      activeId === item.id ? 'bg-[#EECE84]/10' : ''
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`h-2 w-2 rounded-full ${
                          activeId === item.id ? 'bg-[#EECE84]' : 'bg-gray-400'
                        }`} />
                        <h2 className="font-medium text-white group-hover:text-[#EECE84] transition-colors">
                          {item.title}
                        </h2>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-all ${
                        activeId === item.id ? 'text-[#EECE84]' : 'text-gray-400'
                      } group-hover:text-[#EECE84] ${
                        activeId === item.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                  {index !== filteredSupport.length - 1 && (
                    <Separator className="bg-white/5" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Section - Answer Card */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 lg:p-12"
              >
                <div className="max-w-2xl">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#EECE84]/10 border border-[#EECE84]/20 mb-6">
                    <span className="text-[#EECE84] text-sm">
                      {support.find((item) => item.id === activeId)?.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {support.find((item) => item.id === activeId)?.title}
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed">
                      {support.find((item) => item.id === activeId)?.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPageMarketing;