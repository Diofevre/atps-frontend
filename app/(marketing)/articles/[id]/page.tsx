/* eslint-disable @next/next/no-img-element */
'use client'

import { useParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';

interface Section {
  id: number;
  heading: string;
  section_image: string;
  section_text: string;
}

interface Article {
  id: number;
  title: string;
  title_image: string;
  title_text: string;
  articles_sections: Section[];
}

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`)
      .then(response => response.json())
      .then(data => setArticle(data));
  }, [id]);

  const scrollToSection = useCallback((sectionId: string) => {
    setIsScrolling(true);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Offset to account for any fixed headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Add a small delay to prevent the scroll spy from interfering with the smooth scroll
      setTimeout(() => {
        setIsScrolling(false);
        setActiveSection(sectionId);
      }, 800);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const sections = document.querySelectorAll('[data-section]');
      let currentSection = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          currentSection = section.getAttribute('data-section') || '';
        }
      });

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, isScrolling]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={article.title_image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-800/90" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#EECE84]/10 text-[#EECE84] text-sm mb-6">
              Aviation Guide
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
            <p className="text-lg text-gray-200">{article.title_text}</p>
          </div>
        </div>
      </div>

      {/* Content Section with Table of Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {article.articles_sections.map((section) => {
                    const sectionId = `section-${section.id}`;
                    const isActive = activeSection === sectionId;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(sectionId)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 relative group
                          ${isActive 
                            ? 'bg-[#EECE84]/10 text-[#EECE84]' 
                            : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
                          }`}
                      >
                        <span className="relative z-10 text-sm">
                          {section.heading}
                        </span>
                        {isActive && (
                          <span 
                            className="absolute inset-0 bg-[#EECE84]/10 rounded-lg"
                            style={{
                              transform: 'scale(1)',
                              opacity: 1,
                              transition: 'transform 0.3s ease-in-out, opacity 0.2s ease-in-out'
                            }}
                          />
                        )}
                        <span 
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#EECE84] rounded-r transition-all duration-300
                            ${isActive ? 'h-4' : 'group-hover:h-2'}`}
                        />
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Article Content - Right Side */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-lg p-8">
              {article.articles_sections.map((section) => (
                <div
                  key={section.id}
                  id={`section-${section.id}`}
                  data-section={`section-${section.id}`}
                  className="mb-16 last:mb-0 scroll-mt-20"
                >
                  <h2 className="text-3xl font-bold mb-8 text-[#EECE84]">{section.heading}</h2>
                  <div className="relative h-[300px] mb-8 rounded-lg overflow-hidden">
                    <img
                      src={section.section_image}
                      alt={section.heading}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="prose prose-invert prose-lg max-w-none">
                    {section.section_text.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-300 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePage;