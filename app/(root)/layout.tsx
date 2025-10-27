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
    <div className="flex h-screen relative">
      {/* Beautiful animated background - Hide for login */}
      {!hideBackground && (
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C1E0F1] via-white to-[#C1E0F1]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(193,224,241,0.4),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE5MywyMjQsMjQxLDAuMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          
          {/* Animated shapes */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C1E0F1]/30 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#C1E0F1]/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#C1E0F1]/25 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
      )}

      {/* Content */}
      <div className="flex w-full relative">
        {/* Sidebar with glass effect */}
        {!hideSidebar && (
          <aside className="top-0 left-0 h-full relative hidden md:flex">
            <div className="absolute inset-0 bg-white/50 border-r backdrop-blur-md" />
            <div className="relative">
              <Sidebar />
            </div>
          </aside>
        )}

        {/* Main content */}
        <main 
          className={`overflow-y-auto h-full w-full relative`}
        >
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
