/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react';
import { Newspaper, TrendingUp, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const journalCategories = [
  {
    icon: TrendingUp,
    title: "Airline Hiring Updates",
    description: "Stay ahead in your career planning with the latest recruitment trends and opportunities in aviation.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80"
  },
  {
    icon: AlertTriangle,
    title: "Safety Reports & Analysis",
    description: "Comprehensive analysis of aviation incidents and safety recommendations for pilots.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
  },
  {
    icon: BookOpen,
    title: "Regulatory Updates",
    description: "Stay compliant with the latest aviation regulations and industry standards.",
    image: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=600&q=80"
  }
];

function App() {
  return (
    <div className="min-h-screen relative bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-[12px] bg-[#EECE84]/10 text-[#EECE84] text-sm border border-[#EECE84]/20">
              <Newspaper className="w-4 h-4 mr-2" />
              Aviation Industry Insights
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              ATPS Aviation Journal
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Stay informed with the latest aviation industry news, hiring trends, and safety updates through our comprehensive journal.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {journalCategories.map((category, index) => (
              <div key={index} className="group relative">
                <div className="relative h-[200px] rounded-2xl overflow-hidden mb-6">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/30 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-slate-900/90 backdrop-blur-sm p-2 rounded-lg border border-[#EECE84]/20">
                      <category.icon className="w-5 h-5 text-[#EECE84]" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#EECE84] transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-300">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80"
                  alt="Featured Article"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-gray-900/30 to-transparent" />
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-[#EECE84]/20 shadow-xl max-w-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#EECE84]/10">
                    <TrendingUp className="w-6 h-6 text-[#EECE84]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Latest Industry Trends</p>
                    <p className="text-gray-400 mt-1">Updated weekly with fresh insights</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Your Source for Aviation Excellence
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  The ATPS Aviation Journal aggregates insights from trusted aviation sources to keep you informed on the latest developments in the industry. From career opportunities to safety protocols, we provide comprehensive coverage of everything that matters in aviation.
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-[#EECE84]/20">
                  <h3 className="text-lg font-semibold text-white mb-2">Weekly Updates Include:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-[#EECE84]/10">
                        <TrendingUp className="w-4 h-4 text-[#EECE84]" />
                      </div>
                      <span className="text-gray-300">Latest airline hiring updates and career opportunities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-[#EECE84]/10">
                        <AlertTriangle className="w-4 h-4 text-[#EECE84]" />
                      </div>
                      <span className="text-gray-300">Comprehensive accident & safety reports analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-[#EECE84]/10">
                        <BookOpen className="w-4 h-4 text-[#EECE84]" />
                      </div>
                      <span className="text-gray-300">Industry trends & regulatory changes coverage</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button 
                size="lg"
                className="group bg-[#EECE84] hover:bg-[#EECE84]/90 text-gray-900 rounded-[12px] px-8 h-12 text-sm transition-all duration-300"
              >
                <span className="flex items-center">
                  Read the ATPS Aviation Journal
                  <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;