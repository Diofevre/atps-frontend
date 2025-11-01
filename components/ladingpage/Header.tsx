/* eslint-disable @next/next/no-img-element */
'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@/lib/mock-clerk';
import { Menu, X, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useI18n } from '@/lib/i18n/context';

const Header = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isOpen
          ? 'bg-slate-900/80 backdrop-blur-xl py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center">
          {/* Logo - Fixed Width */}
          <div className="w-[180px]">
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <img
                  src="/atps-default.png"
                  alt="ATPS"
                  className="w-8 h-8 text-[#EECE84] transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                />
                <div className="absolute inset-0 bg-[#EECE84] blur-lg opacity-20 rounded-full transform -rotate-45 group-hover:opacity-30 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white">
                  ATPS
                </span>
                <span className="text-[10px] font-medium text-gray-400">
                  Airline Transport Pilot School
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-8">
              {[
                { title: t.header.partnerships, path: '/partnerships' },
                { title: t.header.blog, path: '/blog' },
                { title: t.header.faqs, path: '/faqs' },
                { title: t.header.pricing, path: '/pricing' },
                { title: t.header.community, path: '/community' },
                { title: t.header.latestNews, path: '/latest_news' },
              ].map((menu, index) => (
                <li key={index} className="relative group">
                  <Link href={menu.path}>
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        pathname === menu.path
                          ? 'text-[#EECE84]'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {menu.title}
                    </span>
                  </Link>
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#EECE84] transition-all duration-300 ${
                      pathname === menu.path ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Language Switcher - Desktop */}
          <div className="hidden lg:flex items-center justify-end mr-4 relative language-dropdown">
            <button
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{languages.find(l => l.code === language)?.flag}</span>
            </button>
            {languageDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-xl">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLanguageDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                      language === lang.code ? 'bg-[#EECE84]/10' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm font-medium text-white">{lang.label}</span>
                    {language === lang.code && <span className="ml-auto text-[#EECE84]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Auth Buttons - Fixed Width */}
          <div className="hidden lg:flex items-center gap-4 w-[180px] justify-end">
            <div className="flex items-center gap-4">
              <Link href="/login">
                <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300">
                  {t.header.login}
                </button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg" 
                  className="relative group bg-[#EECE84] hover:bg-[#EECE84]/90 text-slate-900 rounded-[24px] px-4 h-12 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center font-medium">
                    {t.header.signUp}
                    <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                      ⟶
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button & Auth */}
          <div className="lg:hidden flex flex-1 items-center justify-end gap-2">
            {/* Mobile Language Switcher */}
            <div className="relative language-dropdown">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">{languages.find(l => l.code === language)?.flag}</span>
              </button>
              {languageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-xl z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                        language === lang.code ? 'bg-[#EECE84]/10' : ''
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium text-white">{lang.label}</span>
                      {language === lang.code && <span className="ml-auto text-[#EECE84]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href="/login">
              <button className="group relative px-4 py-2 bg-[#EECE84] text-black rounded-[24px] overflow-hidden transition-all duration-300">
                <span className="relative z-10 flex items-center font-medium text-sm">
                  {t.header.login}
                  <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                    ⟶
                  </span>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors duration-300"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[71px] bg-slate-900/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-6 py-6">
            <ul className="flex flex-col gap-4">
              {[
                { title: t.header.partnerships, path: '/partnerships' },
                { title: t.header.blog, path: '/blog' },
                { title: t.header.faqs, path: '/faqs' },
                { title: t.header.pricing, path: '/pricing' },
                { title: t.header.community, path: '/community' },
                { title: t.header.latestNews, path: '/latest_news' },
              ].map((menu, index) => (
                <li key={index}>
                  <Link href={menu.path}>
                    <span
                      className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        pathname === menu.path
                          ? 'bg-[#EECE84]/10 text-[#EECE84]'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {menu.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-white/5">
              <Link href="/login">
                <button className="w-full group relative px-6 py-4 bg-[#EECE84] text-black rounded-[24px] overflow-hidden transition-all duration-300">
                  <div className="relative z-10 flex items-center justify-center text-sm font-medium">
                    Join ATPS
                    <span className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform">
                      ⟶
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;