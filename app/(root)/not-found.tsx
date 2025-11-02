'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/50 dark:via-slate-900 dark:to-blue-950/50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-900 rounded-full p-8 shadow-xl">
                <Compass className="w-24 h-24 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 mb-4 tracking-tight">
            404
          </h1>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
            This page doesn't exist or may have been moved. Please check the URL or return to your dashboard.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go to Dashboard
            </Link>

            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl font-medium text-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>

          {/* Additional Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Link
              href="/dashboard"
              className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Return to your main dashboard
              </p>
            </Link>

            <Link
              href="/questions-bank"
              className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Questions Bank
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continue studying questions
              </p>
            </Link>

            <Link
              href="/courses"
              className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Courses
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse available courses
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

