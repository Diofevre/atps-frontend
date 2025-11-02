'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

const CookieConsent = () => {
  const { t } = useI18n();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie_consent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const savedPreferences = JSON.parse(cookieConsent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(onlyNecessary);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
    
    // Initialize analytics only if user accepted
    if (prefs.analytics) {
      initializeAnalytics();
    }
  };

  const initializeAnalytics = () => {
    // Add your analytics initialization here (Google Analytics, etc.)
    // Example: window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    console.log('Analytics initialized');
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    // Necessary cookies cannot be disabled
    if (key === 'necessary') return;
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-gradient-to-t from-slate-900 via-slate-800 to-slate-800 border-t border-slate-700 shadow-2xl">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-atps-yellow/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-atps-yellow" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {t.cookieConsent.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {t.cookieConsent.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <Link 
                    href="/cookie-policy" 
                    className="hover:text-atps-yellow transition-colors underline"
                  >
                    {t.cookieConsent.learnMore}
                  </Link>
                  <span>•</span>
                  <Link 
                    href="/privacy-policy" 
                    className="hover:text-atps-yellow transition-colors underline"
                  >
                    {t.cookieConsent.privacyPolicy}
                  </Link>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium whitespace-nowrap"
                >
                  {t.cookieConsent.rejectAll}
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-2 border border-atps-yellow/50 text-atps-yellow rounded-lg hover:bg-atps-yellow/10 transition-colors font-medium whitespace-nowrap"
                >
                  {t.cookieConsent.customize}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 bg-atps-yellow text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-bold whitespace-nowrap"
                >
                  {t.cookieConsent.acceptAll}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative border-b border-slate-700 p-6">
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-2xl font-bold text-white mb-2">
                {t.cookieConsent.settingsTitle}
              </h2>
              <p className="text-sm text-gray-400">
                {t.cookieConsent.settingsDescription}
              </p>
            </div>

            {/* Cookie Categories */}
            <div className="p-6 space-y-6">
              {/* Necessary Cookies */}
              <CookieCategory
                title={t.cookieConsent.categories.necessary.title}
                description={t.cookieConsent.categories.necessary.description}
                enabled={preferences.necessary}
                toggleEnabled={() => {}}
                required
              />

              {/* Analytics Cookies */}
              <CookieCategory
                title={t.cookieConsent.categories.analytics.title}
                description={t.cookieConsent.categories.analytics.description}
                enabled={preferences.analytics}
                toggleEnabled={() => togglePreference('analytics')}
              />

              {/* Marketing Cookies */}
              <CookieCategory
                title={t.cookieConsent.categories.marketing.title}
                description={t.cookieConsent.categories.marketing.description}
                enabled={preferences.marketing}
                toggleEnabled={() => togglePreference('marketing')}
              />

              {/* Preferences Cookies */}
              <CookieCategory
                title={t.cookieConsent.categories.preferences.title}
                description={t.cookieConsent.categories.preferences.description}
                enabled={preferences.preferences}
                toggleEnabled={() => togglePreference('preferences')}
              />
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-700 p-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <Link
                href="/cookie-policy"
                className="text-sm text-gray-400 hover:text-atps-yellow transition-colors underline"
              >
                {t.cookieConsent.learnMore}
              </Link>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  {t.cookieConsent.cancel}
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2 bg-atps-yellow text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors font-bold flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {t.cookieConsent.savePreferences}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface CookieCategoryProps {
  title: string;
  description: string;
  enabled: boolean;
  toggleEnabled: () => void;
  required?: boolean;
}

const CookieCategory = ({ title, description, enabled, toggleEnabled, required }: CookieCategoryProps) => (
  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {required && (
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded">
            {required ? 'Required' : ''}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
    <div className="flex-shrink-0">
      <button
        onClick={toggleEnabled}
        disabled={required}
        className={`
          relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-atps-yellow focus:ring-offset-2 focus:ring-offset-slate-900
          ${enabled ? 'bg-atps-yellow' : 'bg-gray-600'}
          ${required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-8' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  </div>
);

export default CookieConsent;

