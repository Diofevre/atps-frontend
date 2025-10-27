'use client';

import { ReactNode } from 'react';

interface NewsLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function NewsLayout({ children, showSidebar = false }: NewsLayoutProps) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
