'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, Settings, BarChart3, UserCircle, Shield, Globe, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';
export const dynamic = 'force-dynamic';


export default function CookiePolicy() {
  const { t } = useI18n();
  const [lastUpdated, setLastUpdated] = useState('2024-01-15');

  useEffect(() => {
    setLastUpdated(new Date().toISOString().split('T')[0]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EECE84]/10 border border-[#EECE84]/20 mb-6">
              <Cookie className="w-8 h-8 text-[#EECE84]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              {t.cookiePolicy.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.cookiePolicy.subtitle}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-400">
              {t.cookiePolicy.lastUpdated} {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert prose-lg max-w-none space-y-12">
          
          {/* Section 1 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#EECE84]/10 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">{t.cookiePolicy.section1Title}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {t.cookiePolicy.section1Desc}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#EECE84]/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">{t.cookiePolicy.section2Title}</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t.cookiePolicy.section2Desc}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>{t.cookiePolicy.section2Item1}</li>
                  <li>{t.cookiePolicy.section2Item2}</li>
                  <li>{t.cookiePolicy.section2Item3}</li>
                  <li>{t.cookiePolicy.section2Item4}</li>
                  <li>{t.cookiePolicy.section2Item5}</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#EECE84]/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">{t.cookiePolicy.section3Title}</h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">{t.cookiePolicy.section3Desc1}</h4>
                    <p className="text-gray-300 text-sm">
                      {t.cookiePolicy.section3Desc2}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">{t.cookiePolicy.section3Desc3}</h4>
                    <p className="text-gray-300 text-sm">
                      These cookies enable the website to provide enhanced functionality and personalization. They may be set by 
                      us or by third-party providers.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Analytics Cookies</h4>
                    <p className="text-gray-300 text-sm">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#EECE84]/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">{t.cookiePolicy.section4Title}</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t.cookiePolicy.section4Desc}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 5 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#EECE84]/10 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">{t.cookiePolicy.section5Title}</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t.cookiePolicy.section5Intro}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>{t.cookiePolicy.section5Item1}</li>
                  <li>{t.cookiePolicy.section5Item2}</li>
                  <li>{t.cookiePolicy.section5Item3}</li>
                  <li>{t.cookiePolicy.section5Item4}</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  {t.cookiePolicy.section5Note}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 6 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#EECE84]/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">{t.cookiePolicy.section6Title}</h2>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">{t.cookiePolicy.section6Label1}</strong> {t.cookiePolicy.section6Desc1}
                  <br/><br/>
                  <strong className="text-white">{t.cookiePolicy.section6Label2}</strong> {t.cookiePolicy.section6Desc2}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 7 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-3">{t.cookiePolicy.section7Title}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t.cookiePolicy.section7Desc}
            </p>
          </motion.section>

          {/* Contact Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-br from-[#EECE84]/10 to-[#EECE84]/5 backdrop-blur-xl rounded-2xl p-8 border border-[#EECE84]/20"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#EECE84]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">{t.cookiePolicy.contactTitle}</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t.cookiePolicy.contactDesc}
                </p>
                <p className="text-[#EECE84] font-medium">
                  {t.cookiePolicy.contactEmail}
                </p>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}
