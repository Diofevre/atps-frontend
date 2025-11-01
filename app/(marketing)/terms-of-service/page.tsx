'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Scale, AlertTriangle, Users, Shield, Gavel, Copyright, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';

export default function TermsOfService() {
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
              <Scale className="w-8 h-8 text-[#EECE84]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              {t.termsOfService.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.termsOfService.subtitle}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-400">
              {t.termsOfService.lastUpdated} {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                <FileText className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing and using ATPS, you accept and agree to be bound by the terms and provisions of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
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
                <Users className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">2. User Account</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Compliance with all applicable laws and regulations</li>
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
                <AlertTriangle className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">3. Prohibited Uses</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You may not use our service:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, or laws</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>
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
                <Shield className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">4. Subscription and Billing</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">Subscription Plans:</strong> We offer various subscription plans with different features and pricing.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">Billing:</strong> Subscriptions are billed on a recurring basis according to your selected plan. 
                  You authorize us to charge your payment method for all subscription fees.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">Cancellation:</strong> You may cancel your subscription at any time. 
                  Cancellation takes effect at the end of the current billing period.
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
                <Copyright className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">5. Intellectual Property</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The platform and its original content, features, and functionality are owned by ATPS and are protected by international 
                  copyright, trademark, patent, trade secret, and other intellectual property laws. Our trademarks and trade dress may not 
                  be used in connection with any product or service without our prior written consent.
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
                <Gavel className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">6. Limitation of Liability</h2>
                <p className="text-gray-300 leading-relaxed">
                  ATPS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including 
                  without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
                  of the service.
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
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#EECE84]/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-[#EECE84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">7. Changes to Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the 
                  new Terms of Service on this page.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Contact Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-br from-[#EECE84]/10 to-[#EECE84]/5 backdrop-blur-xl rounded-2xl p-8 border border-[#EECE84]/20"
          >
            <h2 className="text-2xl font-bold text-white mb-3">8. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-[#EECE84] font-medium">
              support@atps.com
            </p>
          </motion.section>

        </div>
      </div>
    </div>
  );
}

