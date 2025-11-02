import React from 'react';
import Link from 'next/link';
import { Plane, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#EECE84]/10 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#964b6b]/10 to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated Plane Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-atps-yellow/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-full p-8">
                <Plane className="w-24 h-24 text-atps-yellow rotate-[-45deg]" />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-atps-yellow via-yellow-400 to-atps-yellow mb-4 tracking-tight">
            404
          </h1>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved or the URL might be incorrect.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-atps-yellow text-gray-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-atps-yellow/50"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go Home
            </Link>
            
            <Link
              href="/faqs"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-800 border-2 border-slate-700 text-white rounded-xl font-medium text-lg hover:bg-slate-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Browse Help
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-slate-700 text-gray-300 rounded-xl font-medium text-lg hover:bg-slate-800 transition-all duration-300 hover:border-slate-600"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>

          {/* Additional Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Link
              href="/faqs"
              className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all duration-300 hover:border-atps-yellow/50 group"
            >
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-atps-yellow transition-colors">
                FAQs
              </h3>
              <p className="text-sm text-gray-400">
                Find answers to common questions
              </p>
            </Link>

            <Link
              href="/pricing"
              className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all duration-300 hover:border-atps-yellow/50 group"
            >
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-atps-yellow transition-colors">
                Pricing
              </h3>
              <p className="text-sm text-gray-400">
                View our subscription plans
              </p>
            </Link>

            <Link
              href="/partnerships"
              className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all duration-300 hover:border-atps-yellow/50 group"
            >
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-atps-yellow transition-colors">
                Partnerships
              </h3>
              <p className="text-sm text-gray-400">
                Partner with ATPS Aviation
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

