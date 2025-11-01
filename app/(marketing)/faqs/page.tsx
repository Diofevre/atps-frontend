'use client';

import React from 'react';
import SupportPageMarketing from '../_components/faqs_details';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';

const FAQs = () => {
  const { t } = useI18n();
  return (
    <div className="min-h-screen pt-32 px-6 lg:px-8 bg-slate-900/80 backdrop-blur-xl">
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
            <span className="text-[#EECE84] text-sm font-medium">{t.faqs.badge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            {t.faqs.title}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t.faqs.subtitle}
          </p>
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <SupportPageMarketing />
        </motion.div>
      </div>
    </div>
  );
};

export default FAQs;