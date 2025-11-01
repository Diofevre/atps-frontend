'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, Settings, BarChart3, UserCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';

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
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Learn about how we use cookies and similar technologies to enhance your experience.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-400">
              Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                <h2 className="text-2xl font-bold text-white mb-3">1. What Are Cookies?</h2>
                <p className="text-gray-300 leading-relaxed">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and to provide information to the website owners.
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
                <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Cookies</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use cookies for various purposes to improve your experience on our platform:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><strong className="text-white">Essential Cookies:</strong> Required for the platform to function properly</li>
                  <li><strong className="text-white">Authentication:</strong> To identify you and keep you logged in</li>
                  <li><strong className="text-white">Preferences:</strong> To remember your settings and preferences</li>
                  <li><strong className="text-white">Analytics:</strong> To understand how visitors interact with our platform</li>
                  <li><strong className="text-white">Performance:</strong> To improve the speed and reliability of the platform</li>
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
                <h2 className="text-2xl font-bold text-white mb-3">3. Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Essential Cookies</h4>
                    <p className="text-gray-300 text-sm">
                      These cookies are necessary for the website to function and cannot be switched off. They are usually set 
                      in response to actions made by you.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Functional Cookies</h4>
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
            <h2 className="text-2xl font-bold text-white mb-3">4. Third-Party Cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver 
              advertisements on and through the service. These third parties may use cookies to collect information about your 
              online activities over time and across different websites.
            </p>
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
                <h2 className="text-2xl font-bold text-white mb-3">5. Managing Cookies</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can 
                  impact your user experience:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>Most web browsers allow you to refuse or accept cookies through their settings</li>
                  <li>You can configure your browser to notify you when cookies are being set</li>
                  <li>You can delete cookies that have been set on your device</li>
                  <li>You can use browser extensions to block cookies</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Note that disabling certain cookies may prevent you from accessing some features of our platform.
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
            <h2 className="text-2xl font-bold text-white mb-3">6. Duration of Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Session Cookies:</strong> These are temporary cookies that expire when you close your browser.
              <br/><br/>
              <strong className="text-white">Persistent Cookies:</strong> These cookies remain on your device for a longer period, 
              or until you delete them manually. They enable us to recognize you when you return to our platform.
            </p>
          </motion.section>

          {/* Section 7 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-3">7. Updates to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, 
              legal, or regulatory reasons. Please revisit this page periodically to stay informed about our use of cookies.
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
                <h2 className="text-2xl font-bold text-white mb-3">8. Contact Us</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <p className="text-[#EECE84] font-medium">
                  support@atps.com
                </p>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}

