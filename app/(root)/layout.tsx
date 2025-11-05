'use client';

import Sidebar from '@/components/shared/Sidebar';
import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const hiddenSidebarRoutes = ['/login', '/signup',
    '/questions-bank/study/quizz', 
    '/questions-bank/exam/quizz_exam',
    '/questions-bank/community',
    '/questions-bank/community/user',
  ];
  const isDynamicRoute = pathname.startsWith('/courses/manuals/');
  // Blog pages show sidebar
  const isBlogRoute = pathname.startsWith('/blog');
  const hideSidebar = (hiddenSidebarRoutes.includes(pathname) || isDynamicRoute) && !isBlogRoute;

  // Hide background for login and signup pages
  const hideBackground = pathname === '/login' || pathname === '/signup';

  return (
    <div className="flex relative overflow-hidden" style={{ height: '100dvh', minHeight: '100vh' }}>
      {/* Beautiful animated background - Hide for login - Theme aware */}
      {!hideBackground && (
        <div className="fixed inset-0 -z-10 bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(193,224,241,0.4),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(30,41,59,0.4),rgba(15,23,42,0))]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE5MywyMjQsMjQxLDAuMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 dark:opacity-10" />
          
          {/* Animated shapes - Theme aware */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/30 dark:bg-slate-700/20 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-100/20 dark:bg-slate-700/15 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-100/25 dark:bg-slate-700/18 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
      )}

      {/* Content */}
      <div className="flex w-full h-full relative overflow-hidden">
        {/* Sidebar with glass effect */}
        {!hideSidebar && (
          <aside className="top-0 left-0 h-full relative flex-shrink-0">
            <div className="absolute inset-0 bg-white/50 border-r backdrop-blur-md hidden md:block" />
            <div className="relative">
              <Sidebar />
            </div>
          </aside>
        )}

        {/* Main content */}
        <main 
          className={`flex-1 overflow-y-auto overflow-x-hidden relative`}
          style={{ 
            height: '100dvh',
            minHeight: '100vh',
            maxHeight: '100dvh',
            width: 'calc(100% - 80px)', // 80px = w-20 (sidebar fermée)
          }}
        >
          <div className="relative z-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
