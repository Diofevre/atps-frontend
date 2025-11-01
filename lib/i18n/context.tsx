'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage first
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'fr' || savedLang === 'es')) {
      setLanguageState(savedLang);
      return;
    }

    // Detect language based on user's location
    const detectLanguageFromLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code;

        // French-speaking countries
        const frenchCountries = ['FR', 'BE', 'CH', 'CA', 'MC', 'LU', 'SN', 'ML', 'BF', 'NE', 'TG', 'BJ', 'TD', 'CF', 'CG', 'CD', 'GA', 'GN', 'CM', 'CI', 'MG', 'BI', 'RW', 'DJ', 'KM', 'RE', 'YT', 'MQ', 'GP', 'PM', 'BL', 'MF', 'NC', 'PF', 'WF'];
        // Spanish-speaking countries
        const spanishCountries = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ'];

        if (frenchCountries.includes(country)) {
          setLanguageState('fr');
        } else if (spanishCountries.includes(country)) {
          setLanguageState('es');
        } else {
          // Default to English or browser language
          const browserLang = navigator.language.split('-')[0];
          if (browserLang === 'fr') {
            setLanguageState('fr');
          } else if (browserLang === 'es') {
            setLanguageState('es');
          }
        }
      } catch (error) {
        // Fallback to browser language if location detection fails
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'fr') {
          setLanguageState('fr');
        } else if (browserLang === 'es') {
          setLanguageState('es');
        }
      }
    };

    detectLanguageFromLocation();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

